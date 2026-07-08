'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function HeroSection() {
  const t = useTranslations('Hero')

  return (
    <section className="relative w-full overflow-hidden bg-hero-gradient bg-clay-texture">
      {/* Thin top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terracota/10 to-transparent" />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center min-h-[85vh] lg:min-h-[90vh] py-20 lg:py-0">
          {/* ── Left Column: Text ── */}
          <div className="w-full lg:w-[55%] lg:pr-12 xl:pr-20 z-10 pt-12 lg:pt-0">
            <ScrollReveal>
              {/* Subtle badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-terracota/8 border border-terracota/12 text-terracota text-[0.75rem] font-medium tracking-wide uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-terracota/60" />
                {t('badge')}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-negro-suave mb-6 max-w-xl">
                {t('titulo')}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <p className="text-[clamp(1rem,1.2vw,1.125rem)] leading-relaxed text-muted max-w-lg mb-10">
                {t('subtitulo')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <div className="flex flex-wrap gap-4">
                <Link href="/productos" className="btn-terracota">
                  {t('cta_primario')}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link href="/nosotros" className="btn-outline">
                  {t('cta_secundario')}
                </Link>
              </div>
            </ScrollReveal>

            {/* Trust signals row */}
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

          {/* ── Right Column: Product Image ── */}
          <div className="w-full lg:w-[45%] relative flex items-center justify-center mt-12 lg:mt-0">
            <ScrollReveal delay={2}>
              <div className="relative">
                {/* Glow effect behind the product */}
                <div className="absolute inset-0 bg-gradient-radial from-terracota/6 via-terracota/3 to-transparent rounded-full scale-150 translate-y-[-5%]" />

                {/* Main product image */}
                <Image
                  src="/img/carrucel/tlalchichi-parado-colima.png"
                  alt="Tlalchichi — figura inspirada en los perros de barro de Colima"
                  className="hero-image-float relative w-full max-w-[500px] lg:max-w-[520px] h-auto object-contain"
                  priority
                  width={520}
                  height={600}
                />

                {/* Subtle ground shadow */}
                <div className="absolute bottom-[-8%] left-[15%] right-[15%] h-6 bg-gradient-to-r from-transparent via-terracota/6 to-transparent blur-xl rounded-full" />
              </div>
            </ScrollReveal>

            {/* Floating detail badges */}
            <div className="absolute top-[15%] -left-4 lg:-left-8 hidden sm:block">
              <div className="bg-white/90 backdrop-blur-sm border border-arena/50 rounded-xl px-3.5 py-2 shadow-sm">
                <p className="text-[0.65rem] font-medium text-muted uppercase tracking-wider">{t('detalle_1')}</p>
                <p className="text-sm font-semibold text-negro-suave mt-0.5">4.2 cm</p>
              </div>
            </div>
            <div className="absolute bottom-[30%] -right-4 lg:-right-8 hidden sm:block">
              <div className="bg-white/90 backdrop-blur-sm border border-arena/50 rounded-xl px-3.5 py-2 shadow-sm">
                <p className="text-[0.65rem] font-medium text-muted uppercase tracking-wider">{t('detalle_2')}</p>
                <p className="text-sm font-semibold text-negro-suave mt-0.5">PET</p>
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
