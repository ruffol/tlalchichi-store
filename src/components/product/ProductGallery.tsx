'use client'

import { useState } from 'react'

interface Props {
  images: string[]
  principal: string | null
  nombre: string
  altTexts?: string[]
}

export default function ProductGallery({ images, principal, nombre, altTexts }: Props) {
  const allImages = [principal, ...images].filter(Boolean) as string[]
  const [selected, setSelected] = useState(0)

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-arena rounded-3xl flex items-center justify-center text-negro-suave/20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-arena rounded-3xl overflow-hidden">
        <img
          src={allImages[selected]}
          alt={altTexts?.[selected] || nombre}
          className="w-full h-full object-cover"
        />
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${
                i === selected ? 'border-terracota' : 'border-transparent hover:border-arena'
              }`}
            >
              <img src={img} alt={altTexts?.[i] || `${nombre} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
