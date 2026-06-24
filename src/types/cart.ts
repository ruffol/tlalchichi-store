import type { Product } from './product'

export interface CartItem {
  product: Product
  quantity: number
}

export type ShippingDestination = 'MX' | 'US' | 'CA' | 'EU'

export const SHIPPING_RATES: Record<
  ShippingDestination,
  { MXN: number; USD: number; label_es: string; label_en: string }
> = {
  MX: { MXN: 150, USD: 0, label_es: 'México', label_en: 'Mexico' },
  US: { MXN: 0, USD: 2500, label_es: 'Estados Unidos', label_en: 'United States' },
  CA: { MXN: 0, USD: 3000, label_es: 'Canadá', label_en: 'Canada' },
  EU: { MXN: 0, USD: 4000, label_es: 'Europa', label_en: 'Europe' },
}
