import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getProductBySlug } from '@/lib/db'
import { Link } from '@/i18n/routing'
import ProductGallery from '@/components/product/ProductGallery'
import AddToCartButton from './AddToCartButton'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import Badge from '@/components/ui/Badge'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const product = getProductBySlug(slug)

  if (!product) return { title: 'Producto no encontrado' }

  const nombre = locale === 'es' ? product.nombre_es : product.nombre_en
  const seoTitle = locale === 'es' ? (product.titulo_seo_es || nombre) : (product.titulo_seo_en || nombre)
  const seoDesc = locale === 'es' ? (product.descripcion_seo_es || product.descripcion_es) : (product.descripcion_seo_en || product.descripcion_en)
  return {
    title: seoTitle,
    description: seoDesc,
    openGraph: {
      title: seoTitle,
      description: seoDesc || '',
      images: product.imagenes?.[0] ? [{ url: product.imagenes[0] }] : [],
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
      <Link
        href="/productos"
        className="inline-flex items-center gap-1 text-sm text-negro-suave/50 hover:text-terracota transition-colors mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {t('volver')}
      </Link>

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
              <h3 className="font-semibold text-negro-suave mb-2">
                {t('historia')}
              </h3>
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
