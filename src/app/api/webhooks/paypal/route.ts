import { NextResponse } from 'next/server'
import { createOrder, createOrderItems } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
      const resource = body.resource
      const purchaseUnit = resource.purchase_units?.[0]
      const amount = parseFloat(purchaseUnit?.amount?.value || '0')

      const order = createOrder({
        email: resource.payer?.email_address || '',
        nombre: resource.payer?.name?.given_name || '',
        pais: 'US',
        moneda: 'USD',
        subtotal: Math.round(amount * 100),
        costo_envio: 2500,
        total: Math.round(amount * 100),
        payment_provider: 'paypal',
        payment_status: 'completed',
        paypal_order_id: resource.id,
      })

      const items = (purchaseUnit?.items || []).map((item: any) => ({
        order_id: order.id,
        product_id: parseInt(item.sku || '0'),
        quantity: parseInt(item.quantity || '1'),
        precio_unitario: Math.round(parseFloat(item.unit_amount?.value || '0') * 100),
      }))

      if (items.length > 0) {
        createOrderItems(items)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('PayPal webhook error:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
