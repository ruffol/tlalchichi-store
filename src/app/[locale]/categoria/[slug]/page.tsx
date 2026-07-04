import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getModelsByType, getProductTypeBySlug } from '@/lib/db'
import { locales } from '@/i18n/routing'
import ProductGrid from '@/components/product/ProductGrid'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const type = getProductTypeBySlug(slug)
  if (!type) return { title: 'Categoría no encontrada' }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tlalchichi.xyz'
  const nombre = locale === 'es' ? type.nombre_es : type.nombre_en
  const currentUrl = `${baseUrl}/${locale}/categoria/${slug}`
  const title = locale === 'es'
    ? `Tlalchichis ${nombre} impresos en 3D — figuras tlalchichi de plástico PET hechas en Colima`
    : `Tlalchichi ${nombre} 3D printed — PET plastic Tlalchichi figures made in Colima Mexico`
  const desc = locale === 'es'
    ? `Descubre nuestros Tlalchichis ${nombre} impresos en 3D. Réplicas en plástico PET impresas en 3D de las icónicas figuras tlalchichi de Colima, México.`
    : `Discover our 3D printed Tlalchichi ${nombre}. PET plastic 3D printed replicas of the iconic Tlalchichi figures from Colima, Mexico.`

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
  const type = getProductTypeBySlug(slug)
  if (!type) notFound()

  const models = getModelsByType(slug)
  const nombre = locale === 'es' ? type.nombre_es : type.nombre_en

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-negro-suave mb-8 capitalize">
        {nombre}
      </h1>
      <ProductGrid models={models} locale={locale} />
    </div>
  )
}
