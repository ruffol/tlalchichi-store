import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { getModels, getProductTypes } from '@/lib/db'
import HeroSection from '@/components/layout/HeroCarousel'
import type { Model } from '@/types'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'HomePage' })
  const ht = await getTranslations({ locale, namespace: 'Hero' })
  const tt = await getTranslations({ locale, namespace: 'TrustBar' })
  const st = await getTranslations({ locale, namespace: 'Story' })
  const pt = await getTranslations({ locale, namespace: 'Process' })
  const gt = await getTranslations({ locale, namespace: 'Gallery' })

  // Gracefully handle missing database (development without native module)
  let featuredModels: any[] = []
  let productTypes: any[] = []
  try {
    productTypes = getProductTypes()
    featuredModels = getModels({ destacado: true, activo: true }).slice(0, 4)
    if (featuredModels.length === 0) {
      featuredModels = getModels({ activo: true }).slice(0, 4)
    }
  } catch {
    // DB not available — render the landing page without products
  }

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO
          ══════════════════════════════════════════ */}
      <HeroSection />

      {/* ══════════════════════════════════════════
          TRUST BAR
          ══════════════════════════════════════════ */}
      <section className="trust-bar-minimal">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-center h-[72px] gap-0">
            {[
              tt('item_1'),
              tt('item_2'),
              tt('item_3'),
              tt('item_4'),
            ].map((item, i) => (
              <div key={item} className="flex items-center">
                {i > 0 && <div className="trust-sep-v mx-6 lg:mx-10 shrink-0" />}
                <div className="flex items-center gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-[18px] h-[18px] text-terracota/70 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-[0.8125rem] text-[#555] dark:text-[#a09892] font-medium whitespace-nowrap">
                    {item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STORY — Más de 2,000 años
          ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-arena-light/60">
        <div className="absolute inset-0 bg-clay-texture opacity-[0.015]" />

        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row items-stretch min-h-[70vh] lg:min-h-[75vh] py-16 lg:py-0">
            {/* Image — takes half on desktop */}
            <div className="w-full lg:w-1/2 relative overflow-hidden lg:min-h-[75vh] -mx-6 sm:-mx-10 lg:mx-0 lg:rounded-2xl">
              <img
                src="/img/carrucel/tlalchichi-viejo-sentado-colima.png"
                alt="Tlalchichi — cerámica prehispánica de Colima"
                className="w-full h-full object-cover absolute inset-0"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              {/* Floating caption */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm border border-arena/60 rounded-xl px-5 py-3 shadow-sm">
                <p className="text-[0.7rem] font-medium text-muted uppercase tracking-wider">
                  {st('caption')}
                </p>
                <p className="text-sm font-semibold text-negro-suave mt-0.5">
                  {st('caption_periodo')}
                </p>
              </div>
            </div>

            {/* Text — takes other half */}
            <div className="w-full lg:w-1/2 flex items-center py-12 lg:py-16 lg:pl-16 xl:pl-20">
              <div className="max-w-lg">
                <p className="text-[0.75rem] font-medium text-terracota uppercase tracking-[0.15em] mb-4">
                  {st('badge')}
                </p>
                <p className="text-[clamp(1.5rem,2.5vw,2.25rem)] font-bold leading-[1.1] tracking-tight text-negro-suave mb-2">
                  {st('titulo_largo')}
                </p>
                <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.1] tracking-tight text-negro-suave mb-6">
                  {st('titulo')}
                </h2>
                <p className="text-base leading-relaxed text-muted mb-6 text-[clamp(0.9375rem,1.1vw,1.0625rem)] leading-[1.7]">
                  {st('texto_intro')}
                </p>
                <p className="text-base leading-relaxed text-muted mb-3">
                  {st('texto_1')}
                </p>
                <p className="text-base leading-relaxed text-muted mb-8">
                  {st('texto_2')}
                </p>
                <Link
                  href="/nosotros"
                  className="btn-outline inline-flex"
                >
                  {st('cta')}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURED COLLECTION
          ══════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <p className="text-[0.75rem] font-medium text-terracota uppercase tracking-[0.15em] mb-3">
                {t('coleccion_badge')}
              </p>
              <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-negro-suave">
                {t('coleccion_titulo')}
              </h2>
            </div>
            <Link
              href="/productos"
              className="text-[0.875rem] font-medium text-terracota hover:text-terracota-dark transition-colors shrink-0 flex items-center gap-1.5"
            >
              {t('ver_todos')}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {featuredModels.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {featuredModels.map((model: any) => (
                <FeaturedProductCard key={model.id} model={model} locale={locale} productTypes={productTypes} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(4)].map((_, i) => (
                <PlaceholderCard key={i} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROCESS — con imágenes
          ══════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-arena-light/40">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-16">
            <p className="text-[0.75rem] font-medium text-terracota uppercase tracking-[0.15em] mb-3">
              {pt('badge')}
            </p>
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-negro-suave">
              {pt('titulo')}
            </h2>
            <p className="text-base text-muted mt-3 max-w-md mx-auto">
              {pt('subtitulo')}
            </p>
          </div>

          <div className="space-y-16 md:space-y-20">
            {[
              { step: 1, icon: 'pen', label: pt('paso_1'), img: '/img/carrucel/tlalchichi-parado-colima.png', desc: locale === 'es' ? 'Modelado digital a partir de las piezas originales de Colima.' : 'Digital modeling based on original Colima pieces.' },
              { step: 2, icon: 'printer', label: pt('paso_2'), img: '/img/productos/portamacetas/tlalchichi-parado-render-colima.png', desc: locale === 'es' ? 'Impresión 3D en PET reciclado de alta resistencia.' : '3D printing in high-resistance recycled PET.' },
              { step: 3, icon: 'sparkles', label: pt('paso_3'), img: '/img/productos/portamacetas/tlalchichi-mediano-sentado-render-colima.png', desc: locale === 'es' ? 'Acabado manual para garantizar calidad y durabilidad.' : 'Manual finishing to ensure quality and durability.' },
              { step: 4, icon: 'box', label: pt('paso_4'), img: '/img/productos/portamacetas/tlalchichi-mascara-render-colima.png', desc: locale === 'es' ? 'Empaque cuidadoso listo para enviar a todo México.' : 'Careful packaging ready to ship nationwide.' },
              { step: 5, icon: 'truck', label: pt('paso_5'), img: '/img/carrucel/tlalchichi-parado-colima.png', desc: locale === 'es' ? 'De Colima directamente a tu hogar.' : 'From Colima straight to your home.' },
            ].map((item, i) => (
              <div key={item.step} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-14`}>
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-arena shadow-sm">
                    <img
                      src={item.img}
                      alt={item.label}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Content */}
                <div className="w-full md:w-1/2 max-w-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-terracota/10 border border-terracota/20 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-terracota">0{item.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-negro-suave">{item.label}</h3>
                  </div>
                  <p className="text-base text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          GALLERY — Piezas en distintos entornos
          ══════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-14">
            <p className="text-[0.75rem] font-medium text-terracota uppercase tracking-[0.15em] mb-3">
              {gt('badge')}
            </p>
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-negro-suave mb-3">
              {gt('titulo')}
            </h2>
            <p className="text-base text-muted max-w-md mx-auto">
              {gt('subtitulo')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              '/img/productos/portamacetas/tlalchichi-acostado-render-colima.png',
              '/img/productos/portamacetas/tlalchichi-parado-render-colima.png',
              '/img/productos/portamacetas/tlalchichi-mediano-sentado-render-colima.png',
              '/img/productos/portamacetas/tlalchichi-mascara-render-colima.png',
              '/img/productos/portamacetas/tlalchichi-viejo-sentado-render-colima.png',
              '/img/productos/portamacetas/tlalchichi-sentado-miniatura-render-colima.png',
              '/img/productos/portamacetas/tlalchichi-mazorca-render-colima.png',
              '/img/productos/portamacetas/tlalchichi-viejo-sentado2-render-colima.png',
            ].map((src, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-xl bg-arena/60 border border-arena/40 ${i === 0 || i === 7 ? 'col-span-2 row-span-2' : ''}`}>
                <div className={`${i === 0 || i === 7 ? 'aspect-square' : 'aspect-[3/4]'}`}>
                  <img
                    src={src}
                    alt={`Tlalchichi portamaceta ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA FINAL
          ══════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-arena-light/40">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 text-center">
          <p className="text-[0.75rem] font-medium text-terracota uppercase tracking-[0.15em] mb-4">
            {t('cta_badge')}
          </p>
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-negro-suave mb-4 max-w-xl mx-auto leading-[1.1]">
            {t('cta_titulo')}
          </h2>
          <p className="text-base text-muted mb-8 max-w-md mx-auto">
            {t('cta_texto')}
          </p>
          <Link href="/productos" className="btn-terracota inline-flex">
            {t('cta_boton')}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}

/* ── Featured Product Card (with price) ── */
function FeaturedProductCard({
  model,
  locale,
  productTypes,
}: {
  model: Model
  locale: string
  productTypes: any[]
}) {
  const nombre = locale === 'es' ? model.nombre_es : model.nombre_en
  const imagen = model.imagenes?.[0] || ''
  const precioMXN = model.precio_mxn || productTypes[0]?.precio_mxn || 0
  const precioUSD = model.precio_usd || productTypes[0]?.precio_usd || 0
  const isES = locale === 'es'

  return (
    <Link
      href={`/producto/${model.slug}`}
      className="group"
    >
      <div className="product-card bg-blanco border border-arena/40 rounded-2xl overflow-hidden">
        <div className="aspect-[4/5] bg-arena overflow-hidden">
          {imagen ? (
            <img
              src={imagen}
              alt={nombre}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="text-sm sm:text-base font-medium text-negro-suave group-hover:text-terracota transition-colors line-clamp-2 leading-snug mb-2">
            {nombre}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-semibold text-negro-suave">
              {isES ? `$${precioMXN} MXN` : `$${precioUSD} USD`}
            </span>
            <span className="text-xs font-medium text-terracota/70 group-hover:text-terracota transition-colors flex items-center gap-1">
              {locale === 'es' ? 'Agregar' : 'Add'}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ── Placeholder card when DB is not available ── */
function PlaceholderCard({ locale }: { locale: string }) {
  return (
    <div className="group">
      <div className="product-card bg-blanco border border-arena/40 rounded-2xl overflow-hidden">
        <div className="aspect-[4/5] bg-arena flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="w-16 h-16 text-muted/20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <div className="p-4 sm:p-5">
          <div className="h-4 bg-arena rounded w-3/4 mb-2" />
          <div className="h-3 bg-arena rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}
