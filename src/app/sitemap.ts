import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/routing'
import { getModels } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.tlalchichi.xyz'
  const today = new Date().toISOString().split('T')[0]

  const staticPages: { path: string; priority: number; freq: 'weekly' | 'monthly' | 'daily' }[] = [
    { path: '', priority: 1, freq: 'daily' },
    { path: '/productos', priority: 0.9, freq: 'daily' },
    { path: '/checkout', priority: 0.3, freq: 'monthly' },
    { path: '/nosotros', priority: 0.7, freq: 'weekly' },
  ]

  const entries: MetadataRoute.Sitemap = []

  // Pages estáticas por idioma
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: today,
        changeFrequency: page.freq,
        priority: page.priority,
      })
    }
  }

  // Productos desde la base de datos
  try {
    const products = getModels({ activo: true })
    for (const locale of locales) {
      for (const product of products) {
        entries.push({
          url: `${baseUrl}/${locale}/producto/${product.slug}`,
          lastModified: today,
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  } catch {
    // Si la DB no existe (primer build), omitimos productos
  }

  return entries
}
