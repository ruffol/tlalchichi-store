import type { Product } from './product'

export interface CartItem {
  product: Product
  quantity: number
}

export type ShippingDestination = 'MX' | 'WORLD'

export const SHIPPING_RATES: Record<
  ShippingDestination,
  { MXN: number; USD: number; label_es: string; label_en: string }
> = {
  MX: { MXN: 100, USD: 0, label_es: 'México', label_en: 'Mexico' },
  WORLD: { MXN: 150, USD: 8, label_es: 'Resto del mundo', label_en: 'Rest of the world' },
}
