import type { Metadata } from 'next'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tlalchichi.xyz'

export const metadata: Metadata = {
  title: 'Tlalchichi Store',
  description: 'Figuras Tlalchichi impresas en 3D — plástico PET hecho en Colima. Llaveros 3D, portamacetas, alcancías y cuencos. Impresión 3D en Colima.',
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

