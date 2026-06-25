import type { Metadata } from 'next'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tlalchichi.xyz'

export const metadata: Metadata = {
  title: 'Tlalchichi Store',
  description: 'Figuras artesanales Tlalchichi — hechas a mano con amor y tradición',
  metadataBase: new URL(baseUrl),
  icons: {
    icon: '/img/favilogotlalchichi.png',
    apple: '/img/favilogotlalchichi.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}

