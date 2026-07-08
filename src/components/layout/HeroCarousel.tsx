'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { useCartStore } from '@/store/cart'
import type { CartItemVariant } from '@/types'

interface HeroProduct {
  id: number
  slug: string
  nombre_es: string
  nombre_en: string
  imagenes: string[]
  precio_mxn: number
  precio_usd: number
  stock: number
  colores?: Array<{ nombre_es: string; nombre_en: string; hex: string; imagen: string }>
}

interface Props {
  models?: HeroProduct[]
  locale?: string
}

export default function HeroSection({ models: propModels, locale }: Props) {
  const t = useTranslations('Hero')
  const productRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((s) => s.addItem)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [slide, setSlide] = useState(0)
  const [addedSlides, setAddedSlides] = useState<Set<number>>(new Set())

  // Fallback products when DB is not available
  const fallbackModels: HeroProduct[] = [
    { id: 0, slug: 'llavero-parado', nombre_es: 'Llavero Tlalchichi Parado', nombre_en: 'Tlalchichi Parado Keychain', imagenes: ['/img/productos/llaveros/tlalchichi-parado-colima.png'], precio_mxn: 35, precio_usd: 2, stock: 42 },
    { id: 1, slug: 'llavero-sentado', nombre_es: 'Llavero Tlalchichi Sentado', nombre_en: 'Tlalchichi Sentado Keychain', imagenes: ['/img/productos/llaveros/tlalchichi-sentado-colima.png'], precio_mxn: 35, precio_usd: 2, stock: 42 },
    { id: 2, slug: 'portamaceta-parado', nombre_es: 'Portamaceta Tlalchichi Parado', nombre_en: 'Tlalchichi Parado Planter', imagenes: ['/img/productos/portamacetas/tlalchichi-parado-render-colima.png'], precio_mxn: 350, precio_usd: 18, stock: 42 },
  ]

  const activeModels = (propModels && propModels.length > 0) ? propModels : fallbackModels
  const hasCarousel = true
  const total = activeModels.length

  const next = useCallback(() => {
    if (!total) return
    setSlide((c) => (c + 1) % total)
  }, [total])

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

  const handleAddToCart = (m: HeroProduct) => {
    const color = m.colores?.[0]
    const img = color?.imagen || m.imagenes?.[0] || ''
    const variant: CartItemVariant = {
      modelId: String(m.id),
      modelSlug: m.slug,
      nombre_es: m.nombre_es,
      nombre_en: m.nombre_en,
      typeId: '1',
      typeSlug: '',
      typeNombreEs: '',
      typeNombreEn: '',
      colorId: '0',
      colorSlug: color?.nombre_es?.toLowerCase().replace(/\s/g, '-') || '',
      colorNombreEs: color?.nombre_es || '',
      colorNombreEn: color?.nombre_en || '',
      colorHex: color?.hex || '#ccc',
      image: img,
      precio_mxn: m.precio_mxn,
      precio_usd: m.precio_usd,
      stock: m.stock,
    }
    addItem(variant)
    setAddedSlides((prev) => new Set(prev).add(slide))
    setTimeout(() => {
      setAddedSlides((prev) => {
        const next = new Set(prev)
        next.delete(slide)
        return next
      })
    }, 2000)
  }

  return (
    <section className="relative w-full overflow-hidden bg-hero-gradient bg-clay-texture">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terracota/10 to-transparent" />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center min-h-[85vh] lg:min-h-[90vh] py-20 lg:py-0">
          {/* ── Left Column: Text (45%) ── */}
          <div className="w-full lg:w-[45%] lg:pr-10 xl:pr-16 z-10 pt-12 lg:pt-0">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-terracota/8 border border-terracota/12 text-terracota text-[0.75rem] font-medium tracking-wide uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-terracota/60" />
                {t('badge')}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <h1 className="text-[clamp(2.2rem,4.5vw,4rem)] font-bold leading-[1.05] tracking-tight text-negro-suave mb-6 max-w-xl">
                {t('titulo')}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <p className="text-[clamp(0.9375rem,1.1vw,1.125rem)] leading-[1.7] text-muted max-w-[520px] mb-10">
                {t('subtitulo')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <div className="flex flex-wrap gap-4">
                <Link href="/productos" className="btn-terracota btn-shine">
                  {t('cta_primario')}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 icon-shift">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link href="/nosotros" className="btn-outline">
                  {t('cta_secundario')}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 icon-shift">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={4}>
              <div className="mt-12 flex items-center gap-6 text-[0.8125rem] text-muted/80">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-terracota/60">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('confianza_1')}</span>
                </div>
                <div className="trust-separator" />
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-terracota/60">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('confianza_2')}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ── Right Column: Product Image / Carousel (55%) ── */}
          <div className="w-full lg:w-[55%] relative flex items-center justify-center mt-12 lg:mt-0 lg:pl-6 xl:pl-10">
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
                {/* Glow effect */}
                <div className="absolute inset-0 hero-product-glow rounded-full scale-150 translate-y-[-5%]" />

                {/* Product images carousel */}
                <div className="relative w-full max-w-[500px] lg:max-w-[540px] mx-auto">
                  {activeModels.map((m, i) => {
                    const img = m.imagenes?.[0] || ''
                    return (
                      <div
                        key={m.slug}
                        className="hero-image-float w-full"
                        style={{
                          opacity: i === slide ? 1 : 0,
                          transition: 'opacity 0.7s ease-in-out',
                          display: i === slide ? 'block' : 'none',
                        }}
                      >
                        <img
                          src={img}
                          alt={locale === 'es' ? m.nombre_es : m.nombre_en}
                          className="w-full h-auto object-contain"
                          style={{ maxHeight: '65vh' }}
                        />
                      </div>
                    )
                  })}

                  {/* Floating add-to-cart button */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                    {activeModels[slide].stock > 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(activeModels[slide])
                        }}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg transition-all duration-200 ${
                          addedSlides.has(slide)
                            ? 'bg-emerald-500 text-white scale-105'
                            : 'bg-white/95 text-negro-suave border border-arena/60 hover:bg-terracota hover:text-white hover:border-terracota hover:shadow-xl'
                        }`}
                      >
                        {addedSlides.has(slide) ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {locale === 'es' ? '¡Agregado!' : 'Added!'}
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            {locale === 'es' ? 'Agregar al carrito' : 'Add to cart'}
                            <span className="text-xs opacity-70">${activeModels[slide].precio_mxn}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/80 text-muted border border-arena/40 shadow-sm">
                        {locale === 'es' ? 'Sin stock' : 'Out of stock'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dots */}
                {total > 1 && (
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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

                {/* Subtle ground shadow */}
                <div className="absolute bottom-[-8%] left-[15%] right-[15%] h-6 bg-gradient-to-r from-transparent via-terracota/6 to-transparent blur-xl rounded-full" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg-page)] to-transparent pointer-events-none" />
    </section>
  )
}
