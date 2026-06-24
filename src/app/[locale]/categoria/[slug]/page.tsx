import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getProducts } from '@/lib/db'
import ProductGrid from '@/components/product/ProductGrid'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function CategoriaPage({ params }: Props) {
  const { locale, slug } = await params
  const products = getProducts({ activo: true, categoria: slug })

  if (products.length === 0) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-negro-suave mb-8 capitalize">
        {slug}
      </h1>
      <ProductGrid products={products} locale={locale} />
    </div>
  )
}
