export interface Order {
  id: string
  email: string
  nombre: string | null
  pais: string
  direccion: Record<string, unknown> | null
  moneda: 'MXN' | 'USD'
  subtotal: number
  costo_envio: number
  total: number
  payment_provider: 'stripe' | 'paypal'
  payment_status: string
  stripe_session_id: string | null
  paypal_order_id: string | null
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  precio_unitario: number
}
