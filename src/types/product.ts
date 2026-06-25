export interface Product {
  id: string
  slug: string
  nombre_es: string
  nombre_en: string
  descripcion_es: string | null
  descripcion_en: string | null
  historia_es: string | null
  historia_en: string | null
  categoria_es: string
  categoria_en: string
  precio_mxn: number
  precio_usd: number
  stock: number
  peso_kg: number | null
  imagen_principal: string | null
  imagenes: string[]
  destacado: boolean
  activo: boolean
  created_at: string
  titulo_seo_es?: string
  titulo_seo_en?: string
  descripcion_seo_es?: string
  descripcion_seo_en?: string
  alt_text_es?: string
  alt_text_en?: string
}

export type ProductFormData = {
  slug: string
  nombre_es: string
  nombre_en: string
  descripcion_es: string
  descripcion_en: string
  historia_es: string
  historia_en: string
  categoria_es: string
  categoria_en: string
  precio_mxn: number
  precio_usd: number
  stock: number
  peso_kg: number
  imagen_principal?: string
}
