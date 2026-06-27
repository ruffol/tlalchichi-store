'use client'

import { useState, useMemo } from 'react'
import AddToCartButton from './AddToCartButton'
import type { CartItemVariant, Color } from '@/types'

interface ModelData {
  id: number
  slug: string
  nombre_es: string
  nombre_en: string
  imagenes: string[]
}

interface TypeData {
  id: number
  slug: string
  nombre_es: string
  nombre_en: string
  precio_mxn: number
  precio_usd: number
  stock: number
}

interface Props {
  model: ModelData
  types: TypeData[]
  colors: Color[]
  locale: string
}

export default function ClientWrapper({ model, types, colors, locale }: Props) {
  const firstTypeId = types.length > 0 ? types[0].id : 0
  const firstColorId = colors.length > 0 ? colors[0].id : 0

  const [selectedTypeId, setSelectedTypeId] = useState<number>(firstTypeId)
  const [selectedColorId, setSelectedColorId] = useState<number>(firstColorId)

  const selectedType = types.find((t) => t.id === selectedTypeId)

  const variant = useMemo<CartItemVariant | null>(() => {
    if (!selectedType) return null
    const color = colors.find((c) => c.id === selectedColorId)
    if (!color) return null
    return {
      modelId: String(model.id),
      modelSlug: model.slug,
      nombre_es: model.nombre_es,
      nombre_en: model.nombre_en,
      typeId: String(selectedType.id),
      typeSlug: selectedType.slug,
      typeNombreEs: selectedType.nombre_es,
      typeNombreEn: selectedType.nombre_en,
      colorId: String(color.id),
      colorSlug: color.slug,
      colorNombreEs: color.nombre_es,
      colorNombreEn: color.nombre_en,
      colorHex: color.hex_code,
      image: model.imagenes?.[0] || '',
      precio_mxn: selectedType.precio_mxn,
      precio_usd: selectedType.precio_usd,
      stock: selectedType.stock,
    }
  }, [selectedType, selectedColorId, model, colors])

  return (
    <div className="space-y-6">
      {/* Tipo de producto */}
      <div>
        <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
          Tipo de producto
        </p>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => {
            const selected = type.id === selectedTypeId
            return (
              <button
                key={type.id}
                onClick={() => setSelectedTypeId(type.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selected
                    ? 'bg-terracota text-white shadow-md'
                    : 'bg-arena text-negro-suave hover:bg-arena/80'
                }`}
              >
                <span>{locale === 'es' ? type.nombre_es : type.nombre_en}</span>
                <span className={`ml-2 ${selected ? 'text-white/80' : 'text-muted'}`}>
                  {locale === 'es'
                    ? `$${type.precio_mxn} MXN`
                    : `$${type.precio_usd.toFixed(2)} USD`}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Color */}
      <div>
        <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
          Color
        </p>
        <div className="flex gap-3">
          {colors.map((color) => {
            const selected = color.id === selectedColorId
            return (
              <button
                key={color.id}
                onClick={() => setSelectedColorId(color.id)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selected ? 'border-terracota ring-2 ring-terracota/30 scale-110' : 'border-arena hover:border-muted'
                }`}
                title={locale === 'es' ? color.nombre_es : color.nombre_en}
                style={{ backgroundColor: color.hex_code }}
              />
            )
          })}
        </div>
        <p className="text-sm text-muted mt-2">
          {locale === 'es'
            ? colors.find((c) => c.id === selectedColorId)?.nombre_es
            : colors.find((c) => c.id === selectedColorId)?.nombre_en}
        </p>
      </div>

      {/* Precio y stock */}
      {selectedType && (
        <div className="space-y-1 pt-2">
          <p className="text-3xl font-semibold text-terracota">
            {locale === 'es'
              ? `$${selectedType.precio_mxn} MXN`
              : `$${selectedType.precio_usd.toFixed(2)} USD`}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>Stock: {selectedType.stock}</span>
            {selectedType.stock <= 3 && selectedType.stock > 0 && (
              <span className="text-amber-600 font-medium">
                — ¡Solo quedan {selectedType.stock}!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Add to cart */}
      {variant && (
        <div className="pt-4">
          <AddToCartButton variant={variant} />
        </div>
      )}
    </div>
  )
}
