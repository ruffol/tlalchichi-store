import { NextResponse } from 'next/server'
import { getPaypalBaseUrl } from '@/lib/paypal'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, pais, moneda, email, nombre, direccion, shipping } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 })
    }

    const baseUrl = getPaypalBaseUrl()
    console.log('[paypal] Using base URL:', baseUrl)
    console.log('[paypal] Client ID:', process.env.PAYPAL_CLIENT_ID?.substring(0, 10) + '...')
    console.log('[paypal] Sandbox:', process.env.PAYPAL_SANDBOX)
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64')

    const accessTokenRes = await fetch(
      `${baseUrl}/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      }
    )
    if (!accessTokenRes.ok) {
      console.error('PayPal auth error:', await accessTokenRes.text())
      return NextResponse.json({ error: 'Error de autenticación con PayPal' }, { status: 500 })
    }
    const { access_token } = await accessTokenRes.json()

    const itemTotal = items.reduce(
      (sum: number, item: any) => sum + item.precio * item.quantity,
      0
    )
    const shippingCost = shipping ?? 0
    const total = itemTotal + shippingCost

    const orderRes = await fetch(
      `${baseUrl}/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: moneda,
                value: total.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: moneda,
                    value: itemTotal.toFixed(2),
                  },
                  shipping: {
                    currency_code: moneda,
                    value: shippingCost.toFixed(2),
                  },
                },
              },
              items: items.map((item: any) => ({
                name: item.nombre,
                unit_amount: {
                  currency_code: moneda,
                  value: item.precio.toFixed(2),
                },
                quantity: item.quantity.toString(),
                category: 'PHYSICAL_GOODS',
              })),
              shipping: {
                name: { full_name: nombre || 'Cliente' },
                address: {
                  address_line_1: direccion || '',
                  admin_area_2: '',
                  country_code: pais === 'MX' ? 'MX' : 'US',
                },
              },
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                landing_page: 'LOGIN',
                user_action: 'PAY_NOW',
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${pais === 'MX' ? 'es' : 'en'}/checkout/success`,
                cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${pais === 'MX' ? 'es' : 'en'}/checkout`,
              },
            },
          },
        }),
      }
    )

    if (!orderRes.ok) {
      const errorText = await orderRes.text()
      console.error('PayPal order error:', errorText)
      return NextResponse.json({ error: 'Error al crear la orden en PayPal' }, { status: 500 })
    }

    const order = await orderRes.json()
    const approvalUrl = order.links?.find(
      (l: any) => l.rel === 'payer-action'
    )?.href

    return NextResponse.json({
      id: order.id,
      approvalUrl: approvalUrl || null,
    })
  } catch (err) {
    console.error('PayPal checkout error:', err)
    return NextResponse.json(
      { error: 'Error al crear la orden de pago' },
      { status: 500 }
    )
  }
}
