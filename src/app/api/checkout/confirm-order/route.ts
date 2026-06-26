import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getResend } from '@/lib/resend'
import { createOrder, createOrderItems, decrementStock } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { session_id } = await req.json()
    if (!session_id) {
      return NextResponse.json({ error: 'session_id required' }, { status: 400 })
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    const metadata = session.metadata || {}
    const moneda = session.currency === 'mxn' ? 'MXN' : 'USD'

    // Extraer items del metadata
    let itemsData: any[] = []
    try {
      if (metadata.items) itemsData = JSON.parse(metadata.items)
    } catch {}

    // Crear orden si no existe ya
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
      subtotal: session.amount_subtotal || 0,
      costo_envio: parseInt(metadata.shipping_cost || '0'),
      total: session.amount_total || 0,
      payment_provider: 'stripe',
      payment_status: 'completed',
      stripe_session_id: session.id,
    })

    if (itemsData.length > 0) {
      const orderItems = itemsData.map((item: any) => ({
        order_id: order.id,
        product_id: parseInt(item.id) || 0,
        quantity: item.quantity || 1,
        precio_unitario: Math.round((item.precio || 0) * (moneda === 'MXN' ? 100 : 100)),
      }))
      createOrderItems(orderItems)

      for (const item of itemsData) {
        const productId = parseInt(item.id)
        if (productId) {
          decrementStock(productId, item.quantity || 1)
        }
      }
    }

    // Enviar email
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = getResend()
        const total = session.amount_total || 0
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Tlalchichi <onboarding@resend.dev>',
          to: session.customer_details?.email || metadata.email,
          subject: 'Gracias por tu compra! - Tlalchichi Store',
          html: `
            <h1>Gracias por tu compra!</h1>
            <p>Hola ${metadata.nombre || 'Cliente'},</p>
            <p>Tu pedido ha sido confirmado.</p>
            <p><strong>Total:</strong> $${(total / 100).toFixed(2)} ${moneda}</p>
            <p>Te enviaremos un correo cuando tu pedido sea enviado.</p>
            <p>Gracias por apoyar el arte mexicano!</p>
          `,
        })
      } catch (emailErr) {
        console.error('[confirm-order] Email error:', emailErr)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[confirm-order] Error:', err)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
