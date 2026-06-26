import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getProducts } from '@/lib/db'
import { locales } from '@/i18n/routing'
import ProductGrid from '@/components/product/ProductGrid'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const products = getProducts({ activo: true, categoria: slug })

  if (products.length === 0) return { title: 'Categoría no encontrada' }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tlalchichi.xyz'
  const nombreSlug = slug.replace(/-/g, ' ')
  const currentUrl = `${baseUrl}/${locale}/categoria/${slug}`
  const title = locale === 'es'
    ? `Tlalchichis ${nombreSlug} — Figuras artesanales de Colima`
    : `Tlalchichi ${nombreSlug} — Handmade figurines from Colima`
  const desc = locale === 'es'
    ? `Descubre nuestra colección de Tlalchichis ${nombreSlug}. Figuras artesanales hechas a mano en Colima, México.`
    : `Discover our collection of Tlalchichi ${nombreSlug}. Handmade artisan figurines from Colima, Mexico.`

  const alternateLanguages: Record<string, string> = {}
  for (const l of locales) {
    alternateLanguages[l] = `${baseUrl}/${l}/categoria/${slug}`
  }
  alternateLanguages['x-default'] = `${baseUrl}/es/categoria/${slug}`

  return {
    title,
    description: desc,
    alternates: {
      canonical: currentUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description: desc,
      url: currentUrl,
      siteName: 'Tlalchichi Store',
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
      images: [{ url: `${baseUrl}/img/iconologotlalchichi.svg`, width: 800, height: 800 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [`${baseUrl}/img/iconologotlalchichi.svg`],
    },
  }
}

export default async function CategoriaPage({ params }: Props) {
  const { locale, slug } = await params
  const products = getProducts({ activo: true, categoria: slug })

  if (products.length === 0) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-negro-suave mb-8 capitalize">
        {slug.replace(/-/g, ' ')}
      </h1>
      <ProductGrid products={products} locale={locale} />
    </div>
  )
}
