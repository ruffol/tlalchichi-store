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
          TRUST BAR — Minimalista
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
              {/* Placeholder cards when DB not available */}
              {[...Array(4)].map((_, i) => (
                <PlaceholderCard key={i} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STORY — ¿Qué es un Tlalchichi?
          ══════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-arena-light/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-clay-texture opacity-[0.015]" />

        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-arena">
                  <img
                    src="/img/carrucel/tlalchichi-viejo-sentado-colima.png"
                    alt="Tlalchichi — perro de barro de Colima"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Floating caption */}
                <div className="absolute -bottom-3 -right-3 bg-white/95 backdrop-blur-sm border border-arena/60 rounded-xl px-5 py-3 shadow-sm">
                  <p className="text-[0.7rem] font-medium text-muted uppercase tracking-wider">
                    {st('caption')}
                  </p>
                  <p className="text-sm font-semibold text-negro-suave mt-0.5">
                    {st('caption_periodo')}
                  </p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2 max-w-lg">
              <p className="text-[0.75rem] font-medium text-terracota uppercase tracking-[0.15em] mb-4">
                {st('badge')}
              </p>
              <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-tight text-negro-suave mb-6 leading-[1.1]">
                {st('titulo')}
              </h2>
              <p className="text-base leading-relaxed text-muted mb-3">
                {st('texto_1')}
              </p>
              <p className="text-base leading-relaxed text-muted mb-8">
                {st('texto_2')}
              </p>
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-terracota hover:text-terracota-dark transition-colors group"
              >
                {st('cta')}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROCESS
          ══════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-16">
            <p className="text-[0.75rem] font-medium text-terracota uppercase tracking-[0.15em] mb-3">
              {pt('badge')}
            </p>
            <h2 className="text-[clamp(1.5rem,2.5vw,2.25rem)] font-bold tracking-tight text-negro-suave">
              {pt('titulo')}
            </h2>
            <p className="text-base text-muted mt-3 max-w-md mx-auto">
              {pt('subtitulo')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 lg:gap-8">
            {[
              { step: 1, icon: 'pen', label: pt('paso_1') },
              { step: 2, icon: 'printer', label: pt('paso_2') },
              { step: 3, icon: 'sparkles', label: pt('paso_3') },
              { step: 4, icon: 'box', label: pt('paso_4') },
              { step: 5, icon: 'truck', label: pt('paso_5') },
            ].map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-center text-center group">
                {/* Step circle */}
                <div className="w-16 h-16 rounded-full bg-arena/80 border border-arena/60 flex items-center justify-center mb-4 transition-all duration-300 group-hover:border-terracota/30 group-hover:bg-terracota/5">
                  {item.icon === 'pen' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-6 h-6 text-terracota">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  )}
                  {item.icon === 'printer' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-6 h-6 text-terracota">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                    </svg>
                  )}
                  {item.icon === 'sparkles' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-6 h-6 text-terracota">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  )}
                  {item.icon === 'box' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-6 h-6 text-terracota">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                  )}
                  {item.icon === 'truck' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-6 h-6 text-terracota">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  )}
                </div>

                {/* Connecting line (hidden on last item) */}
                {i < 4 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-arena/80 to-transparent" />
                )}

                <p className="text-[0.8125rem] font-medium text-negro-suave/70">
                  {item.label}
                </p>
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
