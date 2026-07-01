import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export default function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const isDev = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('railway.app')
  const { pathname } = new URL(req.url)

  // Redirect non-www to www FIRST (before any other processing)
  if (!isDev && host.startsWith('tlalchichi.xyz')) {
    const url = new URL(req.url)
    url.host = 'www.tlalchichi.xyz'
    return NextResponse.redirect(url, 301)
  }

  // Skip intl middleware for sitemap.xml, robots.txt, api, etc.
  const skip = ['/api/', '/_next/', '/img/', '/favicon.ico', '/robots.txt', '/sitemap.xml']
  for (const prefix of skip) {
    if (pathname.startsWith(prefix)) return
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|img|favicon.ico|robots.txt|sitemap.xml).*)', '/sitemap.xml'],
}
