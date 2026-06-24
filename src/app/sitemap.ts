import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/routing'

const products = [
  { slug: 'jarron-barro-negro', updated: '2026-01-01' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const staticPages = ['', '/productos', '/nosotros', '/carrito']

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
      })
    }

    for (const product of products) {
      entries.push({
        url: `${baseUrl}/${locale}/producto/${product.slug}`,
        lastModified: new Date(product.updated),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  return entries
}
