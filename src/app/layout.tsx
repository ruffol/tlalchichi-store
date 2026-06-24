import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tlalchichi Store',
  description: 'Artesanías mexicanas hechas a mano con amor y tradición — Tlalchichi',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
