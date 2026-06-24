import { NextResponse } from 'next/server'
import { getStripe, formatAmountForStripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, pais, moneda, email, nombre, direccion, shipping } = body

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      shipping_address_collection: {
        allowed_countries: ['MX', 'US', 'CA', 'DE', 'FR', 'ES', 'IT', 'GB', 'NL'],
      },
      line_items: items.map((item: any) => ({
        price_data: {
          currency: moneda.toLowerCase(),
          product_data: {
            name: item.nombre,
            images: item.imagen ? [item.imagen] : [],
          },
          unit_amount: formatAmountForStripe(item.precio, moneda),
        },
        quantity: item.quantity,
      })),
      metadata: {
        pais,
        nombre,
        direccion: direccion || '',
        shipping_cost: shipping?.toString() || '0',
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${pais === 'MX' ? 'es' : 'en'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${pais === 'MX' ? 'es' : 'en'}/checkout`,
    })

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
