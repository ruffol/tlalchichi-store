import type { Product } from '@/types'
import ProductCard from './ProductCard'

interface Props {
  products: Product[]
  locale: string
}

export default function ProductGrid({ products, locale }: Props) {
  if (products.length === 0) {
    return (
      <p className="text-center text-negro-suave/40 py-12">
        No products found
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  )
}
