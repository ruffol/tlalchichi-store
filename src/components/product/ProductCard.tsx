'use client'

import { useState } from 'react'
import { Link } from '@/i18n/routing'
import { useCartStore } from '@/store/cart'
import type { Model, CartItemVariant } from '@/types'

interface Props {
  model: Model
  locale: string
}

export default function ProductCard({ model, locale }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const nombre = locale === 'es' ? model.nombre_es : model.nombre_en
  const colores = Array.isArray(model.colores) ? model.colores : []
  const isES = locale === 'es'
  const precio = isES ? model.precio_mxn : model.precio_usd
  const selectedColor = colores[selectedColorIdx]

  // Show first color's image, or fallback to model image
  const displayImg = selectedColor?.imagen || model.imagenes?.[0] || ''

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const color = selectedColor
    const variant: CartItemVariant = {
      modelId: String(model.id),
      modelSlug: model.slug,
      nombre_es: model.nombre_es,
      nombre_en: model.nombre_en,
      typeId: '1',
      typeSlug: '',
      typeNombreEs: '',
      typeNombreEn: '',
      colorId: String(selectedColorIdx),
      colorSlug: color?.nombre_es?.toLowerCase().replace(/\s/g, '-') || '',
      colorNombreEs: color?.nombre_es || '',
      colorNombreEn: color?.nombre_en || '',
      colorHex: color?.hex || '#ccc',
      image: color?.imagen || displayImg,
      precio_mxn: model.precio_mxn,
      precio_usd: model.precio_usd,
      stock: model.stock,
    }
    addItem(variant)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="group bg-card border border-card hover:border-arena/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
      <Link
        href={`/producto/${model.slug}`}
        className="block"
      >
        <div className="aspect-[4/5] bg-arena overflow-hidden">
          {displayImg ? (
            <img
              src={displayImg}
              alt={nombre}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <Link href={`/producto/${model.slug}`}>
          <h3 className="font-medium text-negro-suave group-hover:text-terracota transition-colors line-clamp-2 leading-snug">
            {nombre}
          </h3>
        </Link>

        {/* Color selector */}
        {colores.length > 0 && (
          <div className="flex items-center gap-1.5">
            {colores.map((color, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSelectedColorIdx(i)
                }}
                className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                  i === selectedColorIdx
                    ? 'border-terracota scale-110 ring-1 ring-terracota/30'
                    : 'border-arena hover:border-muted'
                }`}
                style={{ backgroundColor: color.hex }}
                title={isES ? color.nombre_es : color.nombre_en}
                aria-label={isES ? color.nombre_es : color.nombre_en}
              />
            ))}
            <span className="text-[0.7rem] text-muted ml-1">
              {isES ? selectedColor?.nombre_es : selectedColor?.nombre_en}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-base font-semibold text-negro-suave">
            {isES ? `$${precio} MXN` : `$${precio?.toFixed(2)} USD`}
          </span>

          {model.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                added
                  ? 'bg-emerald-500 text-white scale-105'
                  : 'bg-terracota text-white hover:bg-terracota-dark hover:shadow-md active:scale-95'
              }`}
            >
              {added ? (
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {isES ? 'Agregado' : 'Added'}
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {isES ? 'Agregar' : 'Add'}
                </span>
              )}
            </button>
          ) : (
            <span className="text-sm text-muted">
              {isES ? 'Sin stock' : 'Out of stock'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
