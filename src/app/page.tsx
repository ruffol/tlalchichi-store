import { getTranslations } from 'next-intl/server'
import { getProductTypes } from '@/lib/db'
import HeroCarousel from '@/components/layout/HeroCarousel'
import CategoryCard from '@/components/product/CategoryCard'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
  const t = await getTranslations({ locale: 'es', namespace: 'HomePage' })
  const types = getProductTypes()

  const catImages: Record<string, string[]> = {
    llaveros: ['/img/productos/llaveros/tlalchichi-sentado-miniatura-colima.png', '/img/productos/llaveros/tlalchichi-parado-colima.png', '/img/productos/llaveros/tlalchichi-joven-viejo-colima.png', '/img/productos/llaveros/varios1.png', '/img/productos/llaveros/varios2.png'],
    portamacetas: ['/img/productos/portamacetas/tlalchichi-acostado-render-colima.png', '/img/productos/portamacetas/tlalchichi-mediano-sentado-render-colima.png', '/img/productos/portamacetas/tlalchichi-sentado-miniatura-rebder-colima.png'],
    alcacias: ['/img/productos/alcacias/tlalchichi-sentado-colima.png', '/img/productos/alcacias/tlalchichi-viejo-sentado-colima.png', '/img/productos/alcacias/tlalchichi-mascara-colima.png'],
    cuencos: ['/img/productos/cuencos/tlalchichi-mazorca-colima.png', '/img/productos/cuencos/tlalchichi-viejo-sentado-color-colima.png'],
  }

  return (
    <>
      <HeroCarousel />

      {types.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12 tracking-tight">
            {t('categories_title') || 'Categorías'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {types.map((type) => (
              <CategoryCard
                key={type.slug}
                slug={type.slug}
                nombre={type.name}
                imagenes={catImages[type.slug] || []}
              />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
