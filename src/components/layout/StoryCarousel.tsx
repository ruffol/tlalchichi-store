'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface TopModel {
  slug: string
  nombre_es: string
  nombre_en: string
  imagenes: string[]
  precio_mxn: number
}

interface Props {
  models: TopModel[]
  locale: string
  caption: string
  captionPeriodo: string
}

export default function StoryCarousel({ models, locale, caption, captionPeriodo }: Props) {
  const [current, setCurrent] = useState(0)
  const total = models.length

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total)
  }, [total])

  useEffect(() => {
    if (total <= 1) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next, total])

  if (!models.length) return null

  const m = models[current]
  const img = m.imagenes?.[0] || ''
  const name = locale === 'es' ? m.nombre_es : m.nombre_en

  return (
    <div className="w-full lg:w-1/2 relative overflow-hidden lg:min-h-[75vh] -mx-6 sm:-mx-10 lg:mx-0 lg:rounded-2xl">
      {/* Images */}
      {models.map((model, i) => {
        const src = model.imagenes?.[0] || ''
        return (
          <div
            key={model.slug}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img
              src={src}
              alt={locale === 'es' ? model.nombre_es : model.nombre_en}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        )
      })}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      {/* Floating caption */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm border border-arena/60 rounded-xl px-5 py-3 shadow-sm z-10">
        <p className="text-[0.7rem] font-medium text-muted uppercase tracking-wider">
          {caption}
        </p>
        <p className="text-sm font-semibold text-negro-suave mt-0.5">
          {captionPeriodo}
        </p>
      </div>

      {/* Bottom dots */}
      {total > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-2 z-10">
          {models.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-terracota w-5'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Clickable overlay to product */}
      <Link
        href={`/${locale !== 'es' ? locale + '/' : ''}producto/${m.slug}`}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label={name}
      />
    </div>
  )
}
