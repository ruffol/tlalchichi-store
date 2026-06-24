'use client'

import { Link } from '@/i18n/routing'
import type { Product } from '@/types'
import Badge from '@/components/ui/Badge'

interface Props {
  product: Product
  locale: string
}

export default function ProductCard({ product, locale }: Props) {
  const nombre = locale === 'es' ? product.nombre_es : product.nombre_en
  const categoria = locale === 'es' ? product.categoria_es : product.categoria_en
  const precio = locale === 'es' ? product.precio_mxn : product.precio_usd
  const moneda = locale === 'es' ? 'MXN' : 'USD'

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group bg-card border border-card hover:border-arena/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      <div className="aspect-[4/5] bg-arena overflow-hidden">
        {product.imagen_principal ? (
          <img
            src={product.imagen_principal}
            alt={nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : product.imagenes?.[0] ? (
          <img
            src={product.imagenes[0]}
            alt={nombre}
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
      <div className="p-4 space-y-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-badge text-muted">
          {categoria}
        </span>
        <h3 className="font-medium text-negro-suave group-hover:text-terracota transition-colors line-clamp-2">
          {nombre}
        </h3>
        <p className="text-lg font-semibold text-terracota">
          {moneda === 'MXN' ? `$${precio} MXN` : `$${(precio / 100).toFixed(2)} USD`}
        </p>
      </div>
    </Link>
  )
}
