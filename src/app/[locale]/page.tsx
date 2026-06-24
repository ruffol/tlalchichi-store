import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { getProducts } from '@/lib/db'
import ProductGrid from '@/components/product/ProductGrid'
import Button from '@/components/ui/Button'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })
  const products = getProducts({ destacado: true, activo: true })

  return (
    <>
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-b from-arena/50 to-blanco">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-negro-suave">
              {t('titulo')}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-negro-suave/60 leading-relaxed">
              {t('subtitulo')}
            </p>
            <div className="mt-10 flex gap-4">
              <Link href="/productos">
                <Button size="lg">{t('cta')}</Button>
              </Link>
              <Link href="/nosotros">
                <Button variant="secondary" size="lg">
                  {t('historia_titulo')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-negro-suave">
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

      <section className="bg-arena/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-negro-suave mb-6">
              {t('historia_titulo')}
            </h2>
            <p className="text-lg text-negro-suave/60 leading-relaxed">
              {t('historia_texto')}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
