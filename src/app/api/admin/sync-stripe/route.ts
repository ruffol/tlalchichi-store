import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

export async function POST(req: Request) {
  const auth = requireAdmin(req)
  if (auth) return auth

  try {
    const { syncAllProductsToStripe } = await import('@/lib/stripe-sync')
    const results = await syncAllProductsToStripe()
    return NextResponse.json({ success: true, count: results.length })
  } catch (err: any) {
    console.error('[admin] Stripe sync error:', err)
    return NextResponse.json({ error: err.message || 'Error syncing to Stripe' }, { status: 500 })
  }
}
