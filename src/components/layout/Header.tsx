'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useCartStore, getItemCount } from '@/store/cart'
import { useState } from 'react'
import LanguageToggle from './LanguageToggle'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'

export default function Header() {
  const t = useTranslations('Navbar')
  const [mobileOpen, setMobileOpen] = useState(false)
  const items = useCartStore((s) => s.items)
  const openCart = useCartStore((s) => s.openCart)
  const count = getItemCount(items)

  return (
    <header className="sticky top-0 z-40 navbar-glass">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo — left */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
          >
            <img src="/img/weblogotlalchichi.png" alt="Tlalchichi" className="h-8 w-auto lg:h-9" />
            <span className="text-base lg:text-xl font-semibold tracking-tight text-negro-suave">
              Tlalchichi
            </span>
          </Link>

          {/* Navigation — centered */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/"
              className="text-[0.8125rem] font-medium text-negro-suave/60 hover:text-negro-suave transition-colors duration-200 tracking-wide"
            >
              {t('inicio')}
            </Link>
            <Link
              href="/productos"
              className="text-[0.8125rem] font-medium text-negro-suave/60 hover:text-negro-suave transition-colors duration-200 tracking-wide"
            >
              {t('productos')}
            </Link>
            <Link
              href="/nosotros"
              className="text-[0.8125rem] font-medium text-negro-suave/60 hover:text-negro-suave transition-colors duration-200 tracking-wide"
            >
              {t('nosotros')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Comprar button — visible on desktop */}
            <Link
              href="/productos"
              className="hidden lg:inline-flex items-center px-5 py-2 bg-terracota text-white text-[0.8125rem] font-medium rounded-full hover:bg-terracota-dark transition-all duration-200"
            >
              {t('comprar')}
            </Link>

            <ThemeToggle />
            <LanguageToggle />

            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-negro-suave/60 hover:text-negro-suave transition-colors duration-200"
              aria-label={t('carrito')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.3}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-terracota text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2.5 text-negro-suave/60 hover:text-negro-suave transition-colors duration-200"
              aria-label="Menú"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}
