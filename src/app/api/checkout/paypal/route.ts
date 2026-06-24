import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, pais, moneda } = body

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64')

    const accessTokenRes = await fetch(
      'https://api-m.paypal.com/v1/oauth2/token',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      }
    )
    const { access_token } = await accessTokenRes.json()

    const total = items.reduce(
      (sum: number, item: any) =>
        sum + item.product.precio_usd * item.quantity,
      0
    )

    const orderRes = await fetch(
      'https://api-m.paypal.com/v2/checkout/orders',
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
                value: ((total + 2500) / 100).toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: moneda,
                    value: (total / 100).toFixed(2),
                  },
                  shipping: {
                    currency_code: moneda,
                    value: '25.00',
                  },
                },
              },
              items: items.map((item: any) => ({
                name: item.product.nombre_en,
                unit_amount: {
                  currency_code: moneda,
                  value: (item.product.precio_usd / 100).toFixed(2),
                },
                quantity: item.quantity.toString(),
                category: 'PHYSICAL_GOODS',
              })),
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                landing_page: 'LOGIN',
                user_action: 'PAY_NOW',
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
                cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
              },
            },
          },
        }),
      }
    )
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
      { error: 'Error creating PayPal order' },
      { status: 500 }
    )
  }
}
