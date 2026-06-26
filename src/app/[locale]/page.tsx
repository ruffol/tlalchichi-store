import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { getProducts } from '@/lib/db'
import ProductGrid from '@/components/product/ProductGrid'
import HeroCarousel from '@/components/layout/HeroCarousel'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })
  const products = getProducts({ destacado: true, activo: true })

  return (
    <>
      <HeroCarousel />

      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-negro-suave tracking-tight">
              {t('destacados')}
            </h2>
            <Link
              href="/productos"
              className="text-sm font-medium text-terracota hover:text-terracota-dark transition-colors"
            >
              {t('cta')} &rarr;
            </Link>
          </div>
          <ProductGrid products={products} locale={locale} />
        </section>
      )}

      <section className="py-24" style={{ background: 'var(--bg-arena-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-negro-suave mb-6 tracking-tight">
              {t('historia_titulo')}
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              {t('historia_texto')}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
