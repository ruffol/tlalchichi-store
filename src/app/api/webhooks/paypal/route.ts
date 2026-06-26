import { NextResponse } from 'next/server'
import { createOrder, createOrderItems, decrementStock } from '@/lib/db'
import { getResend } from '@/lib/resend'
import { getPaypalBaseUrl, getPaypalClientId, getPaypalClientSecret } from '@/lib/paypal'

async function getPayPalAccessToken(): Promise<string> {
  const baseUrl = getPaypalBaseUrl()
  const auth = Buffer.from(
    `${getPaypalClientId()}:${getPaypalClientSecret()}`
  ).toString('base64')
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error('Failed to get PayPal access token')
  const { access_token } = await res.json()
  return access_token
}

async function verifyPayPalWebhook(
  rawBody: string,
  headers: Headers
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  if (!webhookId) {
    console.error('PAYPAL_WEBHOOK_ID not set')
    return false
  }

  const transmissionId = headers.get('paypal-transmission-id')
  const transmissionTime = headers.get('paypal-transmission-time')
  const transmissionSig = headers.get('paypal-transmission-sig')
  const certUrl = headers.get('paypal-cert-url')
  const authAlgo = headers.get('paypal-auth-algo')

  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
    console.error('Missing PayPal webhook headers')
    return false
  }

  try {
    const baseUrl = getPaypalBaseUrl()
    const access_token = await getPayPalAccessToken()
    const verifyRes = await fetch(
      `${baseUrl}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          auth_algo: authAlgo,
          cert_url: certUrl,
          transmission_id: transmissionId,
          transmission_sig: transmissionSig,
          transmission_time: transmissionTime,
          webhook_id: webhookId,
          webhook_event: JSON.parse(rawBody),
        }),
      }
    )
    if (!verifyRes.ok) return false
    const { verification_status } = await verifyRes.json()
    return verification_status === 'SUCCESS'
  } catch {
    return false
  }
}

async function fetchPayPalOrder(orderId: string): Promise<any> {
  const baseUrl = getPaypalBaseUrl()
  const access_token = await getPayPalAccessToken()
  const res = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  if (!res.ok) throw new Error(`Failed to fetch PayPal order ${orderId}`)
  return res.json()
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const body = JSON.parse(rawBody)

    const isValid = await verifyPayPalWebhook(rawBody, req.headers)
    if (!isValid) {
      console.error('PayPal webhook signature verification failed')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const capture = body.resource
      const orderId = capture?.supplementary_data?.related_ids?.order_id
      if (!orderId) {
        console.error('No order_id in capture event')
        return NextResponse.json({ received: true })
      }

      const paypalOrder = await fetchPayPalOrder(orderId)
      const purchaseUnit = paypalOrder.purchase_units?.[0]
      const amount = parseFloat(purchaseUnit?.amount?.value || '0')
      const moneda = purchaseUnit?.amount?.currency_code || 'USD'
      const shipping = purchaseUnit?.shipping || {}

      const items = (purchaseUnit?.items || []).map((item: any, index: number) => ({
        name: item.name,
        quantity: parseInt(item.quantity || '1'),
        unit_amount: parseFloat(item.unit_amount?.value || '0'),
        sku: item.sku || `${index}`,
      }))

      const itemTotal = items.reduce(
        (sum: number, item: any) => sum + item.unit_amount * item.quantity,
        0
      )
      const shippingCost = amount - itemTotal

      const order = createOrder({
        email: paypalOrder.payer?.email_address || '',
        nombre: paypalOrder.payer?.name?.given_name || '',
        pais: shipping?.address?.country_code || 'US',
        direccion: shipping?.address
          ? JSON.stringify({
              line1: shipping.address.address_line_1,
              city: shipping.address.admin_area_2,
              state: shipping.address.admin_area_1,
              postal_code: shipping.address.postal_code,
              country: shipping.address.country_code,
            })
          : '',
        moneda,
        subtotal: Math.round(itemTotal * 100),
        costo_envio: Math.round(shippingCost * 100),
        total: Math.round(amount * 100),
        payment_provider: 'paypal',
        payment_status: 'completed',
        paypal_order_id: orderId,
      })

      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: parseInt(item.sku || '0'),
        quantity: item.quantity,
        precio_unitario: Math.round(item.unit_amount * 100),
      }))

      if (orderItems.length > 0) {
        createOrderItems(orderItems)
      }

      for (const item of items) {
        const productId = parseInt(item.sku || '0')
        if (productId) {
          decrementStock(productId, item.quantity)
        }
      }

      try {
        if (process.env.RESEND_API_KEY) {
          const resend = getResend()
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Tlalchichi <onboarding@resend.dev>',
            to: paypalOrder.payer?.email_address || '',
            subject: 'Gracias por tu compra! - Tlalchichi Store',
            html: `
              <h1>Gracias por tu compra!</h1>
              <p>Hola ${paypalOrder.payer?.name?.given_name || 'Cliente'},</p>
              <p>Tu pedido ha sido confirmado.</p>
              <p><strong>Total:</strong> $${amount.toFixed(2)} ${moneda}</p>
              <p>Te enviaremos un correo cuando tu pedido sea enviado.</p>
              <p>Gracias por apoyar el arte mexicano!</p>
            `,
          })
        }
      } catch (emailErr) {
        console.error('Email error:', emailErr)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('PayPal webhook error:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
