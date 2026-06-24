import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import Button from '@/components/ui/Button'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function SuccessPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Checkout' })

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="#16a34a"
          className="w-8 h-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-negro-suave mb-3">
        {t('exito_titulo')}
      </h1>
      <p className="text-negro-suave/60 mb-8">{t('exito_desc')}</p>
      <Link href="/productos">
        <Button>{t('continuar')}</Button>
      </Link>
    </div>
  )
}
