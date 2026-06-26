import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getProductBySlug } from '@/lib/db'
import { Link, locales } from '@/i18n/routing'
import ProductGallery from '@/components/product/ProductGallery'
import AddToCartButton from './AddToCartButton'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import Badge from '@/components/ui/Badge'
import Breadcrumb from '@/components/ui/Breadcrumb'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const product = getProductBySlug(slug)

  if (!product) return { title: 'Producto no encontrado' }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tlalchichi.xyz'
  const nombre = locale === 'es' ? product.nombre_es : product.nombre_en
  const seoTitle = locale === 'es' ? (product.titulo_seo_es || nombre) : (product.titulo_seo_en || nombre)
  const seoDesc = locale === 'es' ? (product.descripcion_seo_es || product.descripcion_es) : (product.descripcion_seo_en || product.descripcion_en)
  const imagen = product.imagenes?.[0] || ''
  const currentUrl = `${baseUrl}/${locale}/producto/${product.slug}`

  const alternateLanguages: Record<string, string> = {}
  for (const l of locales) {
    alternateLanguages[l] = `${baseUrl}/${l}/producto/${product.slug}`
  }
  alternateLanguages['x-default'] = `${baseUrl}/es/producto/${product.slug}`

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical: currentUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc || '',
      url: currentUrl,
      siteName: 'Tlalchichi Store',
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
      images: imagen ? [{ url: imagen, width: 800, height: 800 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc || '',
      images: imagen ? [imagen] : [],
    },
  }
}

export default async function ProductoDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'ProductDetail' })
  const product = getProductBySlug(slug)

  if (!product) notFound()

  const nombre = locale === 'es' ? product.nombre_es : product.nombre_en
  const categoria = locale === 'es' ? product.categoria_es : product.categoria_en
  const descripcion = locale === 'es' ? product.descripcion_es : product.descripcion_en
  const historia = locale === 'es' ? product.historia_es : product.historia_en
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const productUrl = `${baseUrl}/${locale}/producto/${product.slug}`
  const altTexts = (product.imagenes || []).map((_: string, i: number) =>
    locale === 'es' ? (product.alt_text_es || nombre) : (product.alt_text_en || nombre)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: nombre,
            description: descripcion,
            image: product.imagenes || [],
            category: categoria,
            weight: product.peso_kg ? `${product.peso_kg} kg` : undefined,
            offers: {
              '@type': 'Offer',
              price: locale === 'es' ? product.precio_mxn : product.precio_usd,
              priceCurrency: locale === 'es' ? 'MXN' : 'USD',
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: productUrl,
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: t('inicio'), item: `${baseUrl}/${locale}` },
              { '@type': 'ListItem', position: 2, name: t('productos'), item: `${baseUrl}/${locale}/productos` },
              { '@type': 'ListItem', position: 3, name: nombre },
            ],
          }),
        }}
      />
      <Breadcrumb items={[
        { label: t('inicio'), href: '/' },
        { label: t('productos'), href: '/productos' },
        { label: nombre },
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <ProductGallery
          images={product.imagenes || []}
          principal={product.imagenes?.[0] || null}
          nombre={nombre}
          altTexts={altTexts}
        />

        <div className="space-y-6">
          <div>
            <Badge variant="terracota" className="mb-3">{categoria}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-negro-suave">
              {nombre}
            </h1>
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-semibold text-terracota">
              {locale === 'es'
                ? `$${product.precio_mxn} MXN`
                : `$${product.precio_usd.toFixed(2)} USD`}
            </p>
            {product.peso_kg !== undefined && product.peso_kg !== null && (
              <p className="text-sm text-negro-suave/40">
                {t('peso')}: {product.peso_kg} kg
              </p>
            )}
          </div>

          <div>
            <p className="text-lg text-negro-suave/60 leading-relaxed">
              {descripcion}
            </p>
          </div>

          {historia && (
            <div className="bg-arena/50 rounded-2xl p-6">
              <h2 className="font-semibold text-negro-suave mb-2">
                {t('historia')}
              </h2>
              <p className="text-sm text-negro-suave/60 leading-relaxed">
                {historia}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-negro-suave/40">
            <span>Stock: {product.stock}</span>
            {product.stock <= 3 && product.stock > 0 && (
              <span className="text-amber-600 font-medium">
                — ¡Solo quedan {product.stock}!
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <AddToCartButton product={product} />
            <WhatsAppButton
              productName={nombre}
              productUrl={productUrl}
              floating={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
