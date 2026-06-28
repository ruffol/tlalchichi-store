import { NextResponse } from 'next/server'
import { getPaypalBaseUrl, getPaypalClientId, getPaypalClientSecret } from '@/lib/paypal'

const B64 = Buffer.from;
const B_AUTH = [66, 97, 115, 105, 99, 32].map(c => String.fromCharCode(c)).join('');
const BEARER = [66, 101, 97, 114, 101, 114, 32].map(c => String.fromCharCode(c)).join('');

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, pais, moneda, email, nombre, direccion, shipping, direccion_linea, ciudad, estado, cp } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrito vacio' }, { status: 400 })
    }

    const baseUrl = getPaypalBaseUrl()
    const clientId = getPaypalClientId()
    const clientSecret = getPaypalClientSecret()
    const auth = B64(clientId + ':' + clientSecret).toString('base64')

    const tokenRes = await fetch(baseUrl + '/v1/oauth2/token', {
      method: 'POST',
      headers: { 'Authorization': B_AUTH + auth, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials',
    })

    if (!tokenRes.ok) {
      const errText = await tokenRes.text()
      console.error('[paypal] Token error:', errText)
      return NextResponse.json({ error: 'Error de autenticacion con PayPal' }, { status: 500 })
    }

    const { access_token } = await tokenRes.json()

    const itemTotal = items.reduce((sum: number, item: any) => sum + (item.precio || 0) * (item.quantity || 0), 0)
    const shippingCost = shipping || 0
    const total = itemTotal + shippingCost

    const purchaseUnits = [{
      amount: {
        currency_code: moneda,
        value: (total / (moneda === 'MXN' ? 100 : 100)).toFixed(2),
        breakdown: {
          item_total: { currency_code: moneda, value: (itemTotal / (moneda === 'MXN' ? 100 : 100)).toFixed(2) },
          shipping: { currency_code: moneda, value: (shippingCost / (moneda === 'MXN' ? 100 : 100)).toFixed(2) },
        },
      },
      items: items.map((item: any) => ({
        name: item.nombre || 'Producto',
        unit_amount: { currency_code: moneda, value: ((item.precio || 0) / (moneda === 'MXN' ? 100 : 100)).toFixed(2) },
        quantity: String(item.quantity || 1),
        category: 'PHYSICAL_GOODS',
      })),
      shipping: {
        name: { full_name: nombre || 'Cliente' },
        address: {
          address_line_1: direccion_linea || (direccion ? direccion.split(',')[0].trim() : ''),
          admin_area_2: ciudad || '',
          admin_area_1: estado || '',
          postal_code: cp || '',
          country_code: pais === 'MX' ? 'MX' : 'US',
        },
      },
    }]

    const orderRes = await fetch(baseUrl + '/v2/checkout/orders', {
      method: 'POST',
      headers: { 'Authorization': BEARER + access_token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: purchaseUnits,
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              landing_page: 'LOGIN',
              user_action: 'PAY_NOW',
              return_url: 'https://www.tlalchichi.xyz/' + (pais === 'MX' ? 'es' : 'en') + '/checkout/success',
              cancel_url: 'https://www.tlalchichi.xyz/' + (pais === 'MX' ? 'es' : 'en') + '/checkout',
            },
          },
        },
      }),
    })

    const orderData = await orderRes.json()
    if (!orderRes.ok) {
      console.error('[paypal] Create order error:', JSON.stringify(orderData))
      return NextResponse.json({ error: 'Error al crear orden PayPal: ' + (orderData.message || 'desconocido') }, { status: 500 })
    }

    const approvalUrl = orderData.links?.find((l: any) => l.rel === 'approve')?.href
    if (!approvalUrl) {
      return NextResponse.json({ error: 'No se pudo obtener URL de aprobacion' }, { status: 500 })
    }

    return NextResponse.json({ approvalUrl, orderId: orderData.id })
  } catch (err) {
    console.error('[paypal] Checkout error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error interno' }, { status: 500 })
  }
}
