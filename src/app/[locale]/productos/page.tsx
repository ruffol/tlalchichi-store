import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getProducts, getCategories } from '@/lib/db'
import ProductGrid from '@/components/product/ProductGrid'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ categoria?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ProductGrid' })
  return { title: t('titulo') }
}

export default async function ProductosPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { categoria } = await searchParams
  const t = await getTranslations({ locale, namespace: 'ProductGrid' })

  const products = getProducts({ activo: true, categoria: categoria || undefined })
  const categorias = getCategories(locale)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-negro-suave mb-8">
        {t('titulo')}
      </h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href={`/${locale}/productos`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !categoria
              ? 'bg-terracota text-white'
              : 'bg-arena text-negro-suave hover:bg-arena/80'
          }`}
        >
          {t('filtro_todas')}
        </a>
        {categorias.map((cat: string) => (
          <a
            key={cat}
            href={`/${locale}/productos?categoria=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              categoria === cat
                ? 'bg-terracota text-white'
                : 'bg-arena text-negro-suave hover:bg-arena/80'
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      <Suspense fallback={<div className="text-center py-12 text-negro-suave/40">Cargando...</div>}>
        <ProductGrid products={products} locale={locale} />
      </Suspense>
    </div>
  )
}
