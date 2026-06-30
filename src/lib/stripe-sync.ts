import { getStripe } from './stripe'
import { getDb } from './db'

const CACHE_TABLE = 'stripe_product_cache'

function ensureCacheTable() {
  const db = getDb()
  db.exec(`CREATE TABLE IF NOT EXISTS ${CACHE_TABLE} (
    model_id INTEGER PRIMARY KEY,
    stripe_product_id TEXT NOT NULL,
    stripe_price_id_mxn TEXT NOT NULL,
    stripe_price_id_usd TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
  )`)
}

export function getStripePriceIds(modelId: number): { priceMxn: string; priceUsd: string; productId: string } | null {
  ensureCacheTable()
  const db = getDb()
  const row = db.prepare(`SELECT * FROM ${CACHE_TABLE} WHERE model_id = ?`).get(modelId) as any
  if (!row) return null
  return {
    productId: row.stripe_product_id,
    priceMxn: row.stripe_price_id_mxn,
    priceUsd: row.stripe_price_id_usd,
  }
}

export function saveStripeCache(modelId: number, productId: string, priceMxn: string, priceUsd: string) {
  ensureCacheTable()
  const db = getDb()
  db.prepare(`
    INSERT OR REPLACE INTO ${CACHE_TABLE} (model_id, stripe_product_id, stripe_price_id_mxn, stripe_price_id_usd, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).run(modelId, productId, priceMxn, priceUsd)
}

export async function syncProductToStripe(model: any): Promise<{ productId: string; priceMxn: string; priceUsd: string }> {
  const stripe = getStripe()
  const name = model.nombre_es || model.nombre_en || 'Producto'
  const existing = getStripePriceIds(model.id)

  let productId = existing?.productId

  // Create or update product
  if (productId) {
    // Update existing Stripe product
    try {
      await stripe.products.update(productId, { name, active: true })
    } catch {
      productId = undefined // Product might have been deleted, create a new one
    }
  }

  if (!productId) {
    const product = await stripe.products.create({ name, active: true })
    productId = product.id
  }

  // Create or update prices (always create new prices for changes)
  const priceMxn = await stripe.prices.create({
    product: productId,
    currency: 'mxn',
    unit_amount: Math.round(model.precio_mxn * 100), // Convert MXN to cents
  })

  const priceUsd = await stripe.prices.create({
    product: productId,
    currency: 'usd',
    unit_amount: Math.round(model.precio_usd * 100), // Convert USD to cents
  })

  // Mark old prices as inactive if they existed
  if (existing) {
    try {
      // Deactivate old MXN price
      await stripe.prices.update(existing.priceMxn, { active: false })
    } catch {}
    try {
      // Deactivate old USD price
      await stripe.prices.update(existing.priceUsd, { active: false })
    } catch {}
  }

  saveStripeCache(model.id, productId, priceMxn.id, priceUsd.id)
  return { productId, priceMxn: priceMxn.id, priceUsd: priceUsd.id }
}

export async function syncAllProductsToStripe() {
  const db = getDb()
  const models = db.prepare('SELECT id, nombre_es, nombre_en, precio_mxn, precio_usd FROM models WHERE activo = 1').all() as any[]
  const results = []
  for (const model of models) {
    console.log(`[stripe-sync] Syncing model ${model.id}: ${model.nombre_es}`)
    const result = await syncProductToStripe(model)
    results.push({ modelId: model.id, ...result })
  }
  console.log(`[stripe-sync] Synced ${results.length} products`)
  return results
}
