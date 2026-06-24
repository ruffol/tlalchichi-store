import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getResend } from '@/lib/resend'
import { createOrder, createOrderItems, decrementStock } from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  let stripe
  try {
    stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const metadata = session.metadata || {}
    const moneda = session.currency === 'mxn' ? 'MXN' : 'USD'
    const subtotal = session.amount_subtotal || 0
    const shippingCost = parseInt(metadata.shipping_cost || '0')
    const totalAmount = session.amount_total || 0

    const order = createOrder({
      email: session.customer_details?.email || metadata.email || '',
      nombre: metadata.nombre || '',
      pais: metadata.pais || 'MX',
      direccion: session.shipping_details
        ? JSON.stringify({
            line1: session.shipping_details.address?.line1,
            city: session.shipping_details.address?.city,
            state: session.shipping_details.address?.state,
            postal_code: session.shipping_details.address?.postal_code,
            country: session.shipping_details.address?.country,
          })
        : '',
      moneda,
      subtotal,
      costo_envio: shippingCost,
      total: totalAmount,
      payment_provider: 'stripe',
      payment_status: 'completed',
      stripe_session_id: session.id,
    })

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

    const items = lineItems.data.map((item: any) => ({
      order_id: order.id,
      product_id: parseInt(String(item.price?.product || '0')),
      quantity: item.quantity || 1,
      precio_unitario: item.amount_total || 0,
    }))
    createOrderItems(items)

    for (const item of lineItems.data) {
      const productId = parseInt(String(item.price?.product || '0'))
      if (productId) {
        decrementStock(productId, item.quantity || 1)
      }
    }

    try {
      await getResend().emails.send({
        from: process.env.EMAIL_FROM || 'Tlalchichi <onboarding@resend.dev>',
        to: session.customer_details?.email || metadata.email,
        subject: '¡Gracias por tu compra!',
        html: `
          <h1>¡Gracias por tu compra!</h1>
          <p>Hola ${metadata.nombre || 'Cliente'},</p>
          <p>Tu pedido ha sido confirmado.</p>
          <p><strong>Total:</strong> $${((totalAmount) / 100).toFixed(2)} ${moneda}</p>
          <p>Te enviaremos un correo cuando tu pedido sea enviado.</p>
          <p>¡Gracias por apoyar el arte mexicano!</p>
        `,
      })
    } catch (emailErr) {
      console.error('Email error:', emailErr)
    }
  }

  return NextResponse.json({ received: true })
}
