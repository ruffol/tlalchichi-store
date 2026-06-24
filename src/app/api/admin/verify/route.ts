import { NextResponse } from 'next/server'
import { getSetting } from '@/lib/db'

export async function POST(req: Request) {
  const { password } = await req.json()
  const adminSecret = getSetting('admin_secret')

  if (password === adminSecret) {
    return NextResponse.json({ verified: true })
  }

  return NextResponse.json({ verified: false }, { status: 401 })
}
