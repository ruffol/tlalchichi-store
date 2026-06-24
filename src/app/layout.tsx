import type { Metadata } from 'next'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Tlalchichi Store',
  description: 'Artesanías mexicanas hechas a mano con amor y tradición — Tlalchichi',
  metadataBase: new URL(baseUrl),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}

