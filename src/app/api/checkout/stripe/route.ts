import { NextResponse } from 'next/server'
import { getStripe, formatAmountForStripe } from '@/lib/stripe'
import { getStripePriceIds, syncProductToStripe } from '@/lib/stripe-sync'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, pais, moneda, email, nombre, direccion, shipping } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    const paymentMethods = ['card']
    if (moneda === 'MXN') {
      paymentMethods.push('oxxo')
    }

    const stripe = getStripe()

    // Build line_items using stored Stripe prices when available
    const lineItems = []
    for (const item of items) {
      let priceId = null
      if (item.modelId) {
        const cached = getStripePriceIds(Number(item.modelId))
        if (cached) {
          priceId = moneda === 'MXN' ? cached.priceMxn : cached.priceUsd
        }
      }
      if (priceId) {
        lineItems.push({
          price: priceId,
          quantity: item.quantity,
        })
      } else {
        // Fallback: use inline price_data
        lineItems.push({
          price_data: {
            currency: moneda.toLowerCase(),
            product_data: {
              name: item.nombre,
              images: item.imagen ? [`https://www.tlalchichi.xyz${item.imagen}`] : [],
            },
            unit_amount: formatAmountForStripe(item.precio, moneda),
          },
          quantity: item.quantity,
        })
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: paymentMethods as any,
      customer_email: email,
      shipping_address_collection: {
        allowed_countries: ['MX', 'US', 'CA', 'DE', 'FR', 'ES', 'IT', 'GB', 'NL'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: formatAmountForStripe(shipping || 0, moneda),
              currency: moneda.toLowerCase(),
            },
            display_name: pais === 'MX' ? 'Envío a México' : 'Envío internacional',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
      ],
      line_items: lineItems,
      metadata: {
        pais,
        nombre,
        direccion: direccion || '',
        shipping_cost: shipping?.toString() || '0',
        items: JSON.stringify(items.slice(0, 8).map((i: any) => ({
          q: i.quantity,
          p: i.precio,
        }))),
      },
      success_url: `https://www.tlalchichi.xyz/${pais === 'MX' ? 'es' : 'en'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://www.tlalchichi.xyz/${pais === 'MX' ? 'es' : 'en'}/checkout`,
    })

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
