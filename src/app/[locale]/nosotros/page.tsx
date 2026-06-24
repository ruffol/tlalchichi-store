import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import Button from '@/components/ui/Button'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'About' })
  return { title: t('titulo') }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'About' })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-negro-suave mb-4">
          {t('titulo')}
        </h1>
        <p className="text-lg text-negro-suave/60 max-w-2xl mx-auto">
          {t('subtitulo')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold text-negro-suave mb-4">
            {t('mision_titulo')}
          </h2>
          <p className="text-negro-suave/60 leading-relaxed">
            {t('mision_texto')}
          </p>
        </div>
        <div className="bg-arena rounded-3xl aspect-square flex items-center justify-center">
          <span className="text-negro-suave/20 text-lg">Foto del taller</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-arena rounded-3xl aspect-square flex items-center justify-center order-2 md:order-1">
          <span className="text-negro-suave/20 text-lg">Proceso artesanal</span>
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-2xl font-semibold text-negro-suave mb-4">
            {t('proceso_titulo')}
          </h2>
          <p className="text-negro-suave/60 leading-relaxed">
            {t('proceso_texto')}
          </p>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-2xl font-semibold text-negro-suave mb-6">
          {t('valores_titulo')}
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {(t.raw('valores_lista') as string[]).map((valor: string) => (
            <span
              key={valor}
              className="px-5 py-2.5 bg-arena rounded-full text-sm font-medium"
            >
              {valor}
            </span>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link href="/productos">
          <Button size="lg">{t('cta')}</Button>
        </Link>
      </div>
    </div>
  )
}
