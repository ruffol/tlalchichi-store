import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { getCategories } from '@/lib/db'
import HeroCarousel from '@/components/layout/HeroCarousel'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })
  const categorias = getCategories(locale)

  const categoryIcons: Record<string, string> = {
    Llaveros: '🔑',
    Portamacetas: '🪴',
    'Alcancías': '🐷',
    Cuencos: '🥣',
  }

  return (
    <>
      <HeroCarousel />

      {categorias.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12 tracking-tight">
            Categorías
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categorias.map((cat: string) => (
              <Link
                key={cat}
                href={`/${locale}/productos?categoria=${encodeURIComponent(cat)}`}
                className="group flex flex-col items-center justify-center gap-3 p-8 sm:p-10 bg-card border border-arena rounded-2xl hover:border-terracota/50 hover:shadow-lg hover:shadow-terracota/10 transition-all duration-300"
              >
                <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300">
                  {categoryIcons[cat] || '🎨'}
                </span>
                <span className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-terracota transition-colors">
                  {cat}
                </span>
                <span className="text-sm text-muted">Ver productos →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="py-24" style={{ background: 'var(--bg-arena-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
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
