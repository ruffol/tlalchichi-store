'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export default function Footer() {
  const t = useTranslations('Footer')

  return (
    <footer className="py-16 mt-24" style={{ background: 'var(--footer-bg)', color: '#e8e2da' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Tlalchichi Store</h3>
            <p className="text-sm" style={{ color: 'var(--footer-text)' }}>
              {t('envios')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Navegación</h3>
            <nav className="flex flex-col gap-2 text-sm" style={{ color: 'var(--footer-text)' }}>
              <Link href="/" className="hover:text-terracota-light transition-colors">
                {t('inicio')}
              </Link>
              <Link href="/productos" className="hover:text-terracota-light transition-colors">
                {t('productos')}
              </Link>
              <Link href="/nosotros" className="hover:text-terracota-light transition-colors">
                {t('nosotros')}
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">{t('contacto')}</h3>
            <p className="text-sm" style={{ color: 'var(--footer-text)' }}>{t('pagos')}</p>
          </div>
        </div>
        <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid var(--footer-border)', color: 'var(--footer-text)' }}>
          &copy; {new Date().getFullYear()} Tlalchichi. {t('derechos')}.
        </div>
      </div>
    </footer>
  )
}
