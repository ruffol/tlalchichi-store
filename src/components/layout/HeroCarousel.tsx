'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface HeroProduct {
  id: number
  slug: string
  nombre_es: string
  nombre_en: string
  imagenes: string[]
  precio_mxn: number
  precio_usd: number
  stock: number
}

interface Props {
  models?: HeroProduct[]
  locale?: string
}

export default function HeroSection({ models: propModels, locale }: Props) {
  const t = useTranslations('Hero')
  const productRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [slide, setSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const fallbackModels: HeroProduct[] = [
    { id: 0, slug: 'llavero-parado', nombre_es: 'Llavero Tlalchichi Parado', nombre_en: 'Tlalchichi Parado Keychain', imagenes: ['/img/productos/llaveros/tlalchichi-parado-colima.png'], precio_mxn: 35, precio_usd: 2, stock: 42 },
    { id: 1, slug: 'llavero-mascara', nombre_es: 'Llavero Tlalchichi con Máscara', nombre_en: 'Tlalchichi Mask Keychain', imagenes: ['/img/productos/llaveros/tlalchichi-mascara-colima.png'], precio_mxn: 35, precio_usd: 2, stock: 42 },
    { id: 2, slug: 'portamaceta-parado', nombre_es: 'Portamaceta Tlalchichi Parado', nombre_en: 'Tlalchichi Parado Planter', imagenes: ['/img/productos/portamacetas/tlalchichi-parado-render-colima.png'], precio_mxn: 350, precio_usd: 18, stock: 42 },
  ]

  const activeModels = (propModels && propModels.length > 0) ? propModels : fallbackModels
  const total = activeModels.length
  const current = activeModels[slide]
  const isES = locale === 'es'

  const next = useCallback(() => {
    if (!total) return
    setSlide((c) => (c + 1) % total)
  }, [total])

  useEffect(() => {
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (total <= 1) return
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [next, total])

  useEffect(() => {
    const el = productRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const x = (e.clientX - centerX) / (rect.width / 2)
      const y = (e.clientY - centerY) / (rect.height / 2)
      setRotateY(x * 3)
      setRotateX(-y * 3)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => {
      setIsHovering(false)
      setRotateX(0)
      setRotateY(0)
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseenter', handleMouseEnter)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const badgeClass = "bg-white/90 dark:bg-[#2A2723]/95 backdrop-blur-sm border border-arena/60 dark:border-[#3A3530] rounded-xl px-3 py-2 shadow-sm"

  return (
    <section className="relative w-full overflow-hidden bg-hero-gradient bg-clay-texture">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terracota/10 to-transparent" />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center min-h-[85vh] lg:min-h-[90vh] pt-16 pb-12 lg:pt-0 lg:pb-0">
          {/* ── Left Column: Text (45%) ── */}
          <div className="w-full lg:w-[45%] lg:pr-10 xl:pr-16 z-10 pt-4 lg:pt-0">
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-terracota/20 via-terracota/5 to-transparent" style={{ left: '2rem' }} />

            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-terracota/8 border border-terracota/12 text-terracota text-[0.75rem] font-medium tracking-wide uppercase mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-terracota/60" />
                {t('badge')}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <h1 className="text-[clamp(1.8rem,3.8vw,3.2rem)] font-bold leading-[1.05] tracking-tight text-negro-suave mb-5 max-w-lg">
                {t('titulo')}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <p className="text-[clamp(0.9rem,1.05vw,1.0625rem)] font-medium leading-[1.7] text-muted max-w-[480px] mb-10">
                {t('subtitulo')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/productos" className="btn-terracota btn-shine">
                  {t('cta_primario')}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 icon-shift">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link href="/nosotros" className="group inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-muted hover:text-terracota transition-colors">
                  {t('cta_secundario')}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>

            {/* Trust signals below buttons */}
            <ScrollReveal delay={4}>
              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8rem] text-muted/80">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 text-xs">★★★★★</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-terracota/60">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <span>{t('confianza_1')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-terracota/60">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Pago seguro</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-terracota/60">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                  <span>{t('badge')}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ── Right Column: Product (55%) ── */}
          <div className="w-full lg:w-[55%] relative flex flex-col items-center justify-center mt-8 lg:mt-0 lg:pl-6 xl:pl-10">
            <ScrollReveal delay={2}>
              <div
                ref={productRef}
                className="relative cursor-default"
                style={{
                  transform: isHovering
                    ? `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.18)`
                    : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1.18)',
                  transition: isHovering
                    ? 'transform 0.08s ease-out'
                    : 'transform 0.5s cubic-bezier(0.25, 0.4, 0.25, 1)',
                  transformOrigin: 'center center',
                  marginTop: '-15px',
                  marginRight: '-20px',
                }}
              >
                {/* Stronger glow — extends beyond card */}
                <div className="absolute inset-0 hero-product-glow rounded-full scale-[2] -translate-y-[8%]" />

                {/* Card with product image — clickable */}
                <Link href={`/producto/${current.slug}`}>
                  <div
                    className="hero-product-card"
                    style={{
                      opacity: loaded ? 1 : 0,
                      transform: loaded ? 'translateY(0)' : 'translateY(15px)',
                      transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
                    }}
                  >
                    <div className="relative w-full max-w-[500px] lg:max-w-[540px] mx-auto">
                      {activeModels.map((m, i) => {
                        const img = m.imagenes?.[0] || ''
                        return (
                          <div
                            key={m.slug}
                            className="w-full"
                            style={{
                              opacity: i === slide ? 1 : 0,
                              transition: 'opacity 0.7s ease-in-out',
                              display: i === slide ? 'block' : 'none',
                            }}
                          >
                            <img
                              src={img}
                              alt={isES ? m.nombre_es : m.nombre_en}
                              className="w-full h-auto object-contain hero-image-float"
                              style={{ maxHeight: '68vh' }}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </Link>

                {/* Product name + price below card */}
                <div className="text-center mt-4">
                  <Link href={`/producto/${current.slug}`} className="hover:text-terracota transition-colors">
                    <p className="text-sm font-semibold text-negro-suave">
                      {isES ? current.nombre_es : current.nombre_en}
                    </p>
                  </Link>
                  <p className="text-lg font-bold text-terracota mt-0.5">
                    {isES ? `$${current.precio_mxn} MXN` : `$${current.precio_usd.toFixed(2)} USD`}
                  </p>
                </div>

                {/* Dots */}
                {total > 1 && (
                  <div className="flex justify-center gap-2 mt-3">
                    {activeModels.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSlide(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === slide
                            ? 'bg-terracota w-6'
                            : 'bg-terracota/20 w-1.5 hover:bg-terracota/40'
                        }`}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Ground shadow */}
                <div className="absolute bottom-[-8%] left-[15%] right-[15%] h-6 bg-gradient-to-r from-transparent via-terracota/6 to-transparent blur-xl rounded-full" />
              </div>
            </ScrollReveal>

            {/* Floating badges — closer to the product */}
            <div className="hidden lg:block">
              <div className={`absolute -left-2 top-[12%] ${badgeClass}`}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracota/60" />
                  <span className="text-[0.7rem] font-medium text-negro-suave dark:text-[#E8E2DA] whitespace-nowrap">{isES ? 'Hecho en Colima' : 'Made in Colima'}</span>
                </div>
              </div>
              <div className={`absolute -right-2 top-[38%] ${badgeClass}`}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5 text-terracota shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <span className="text-[0.7rem] font-medium text-negro-suave dark:text-[#E8E2DA] whitespace-nowrap">{isES ? 'Envíos nacionales' : 'Nationwide'}</span>
                </div>
              </div>
              <div className={`absolute -left-2 bottom-[30%] ${badgeClass}`}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5 text-terracota shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                  <span className="text-[0.7rem] font-medium text-negro-suave dark:text-[#E8E2DA] whitespace-nowrap">{isES ? 'PET reciclado' : 'Recycled PET'}</span>
                </div>
              </div>
              <div className={`absolute -right-2 bottom-[18%] ${badgeClass}`}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5 text-terracota shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  <span className="text-[0.7rem] font-medium text-negro-suave dark:text-[#E8E2DA] whitespace-nowrap">{isES ? 'Edición única' : 'Unique edition'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg-page)] to-transparent pointer-events-none" />
    </section>
  )
}
