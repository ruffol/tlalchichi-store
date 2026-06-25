import { NextResponse } from 'next/server'
import { getStripe, formatAmountForStripe } from '@/lib/stripe'
import { createOrder, createOrderItems, decrementStock } from '@/lib/db'
import { getResend } from '@/lib/resend'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { paymentIntentId, items, pais, moneda, form, shipping } = body

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Falta paymentIntentId' }, { status: 400 })
    }

    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Pago no completado' }, { status: 400 })
    }

    const direccion = `${form.direccion}, ${form.ciudad}, ${form.estado}, ${form.cp}`
    const totalInCents = formatAmountForStripe(body.total || 0, moneda)
    const shippingInCents = formatAmountForStripe(shipping || 0, moneda)
    const subtotalInCents = totalInCents - shippingInCents

    const order = createOrder({
      email: form.email,
      nombre: form.nombre,
      pais,
      direccion,
      moneda,
      subtotal: subtotalInCents,
      costo_envio: shippingInCents,
      total: totalInCents,
      payment_provider: 'stripe',
      payment_status: 'completed',
      stripe_session_id: paymentIntentId,
    })

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: parseInt(item.id, 10),
      quantity: item.quantity,
      precio_unitario: formatAmountForStripe(item.precio, moneda),
    }))
    createOrderItems(orderItems)

    for (const item of items) {
      const productId = parseInt(item.id, 10)
      if (productId) {
        decrementStock(productId, item.quantity)
      }
    }

    try {
      await getResend().emails.send({
        from: process.env.EMAIL_FROM || 'Tlalchichi <onboarding@resend.dev>',
        to: form.email,
        subject: '¡Gracias por tu compra!',
        html: `
          <h1>¡Gracias por tu compra!</h1>
          <p>Hola ${form.nombre || 'Cliente'},</p>
          <p>Tu pedido ha sido confirmado.</p>
          <p><strong>Total:</strong> $${(body.total || 0).toFixed(moneda === 'MXN' ? 0 : 2)} ${moneda}</p>
          <p>Te enviaremos un correo cuando tu pedido sea enviado.</p>
          <p>¡Gracias por apoyar el arte mexicano!</p>
        `,
      })
    } catch (emailErr) {
      console.error('Email error:', emailErr)
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err) {
    console.error('confirm-order error:', err)
    return NextResponse.json({ error: 'Error al confirmar la orden' }, { status: 500 })
  }
}
