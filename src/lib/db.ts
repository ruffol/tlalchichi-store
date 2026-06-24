import Database from 'better-sqlite3'
import path from 'path'
import seedData from './seed.json'
const seedProducts: any[] = seedData

const DB_PATH = process.env.NODE_ENV === 'production'
  ? '/data/tlalchichi.db'
  : path.join(process.cwd(), '.data', 'tlalchichi.db')

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!_db) {
    const fs = require('fs')
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    _db = new Database(DB_PATH)
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')
    initTables()
    seedProductsForce()
  }
  return _db
}

function initTables() {
  const db = _db!

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      nombre_es TEXT NOT NULL,
      nombre_en TEXT NOT NULL,
      descripcion_es TEXT,
      descripcion_en TEXT,
      historia_es TEXT,
      historia_en TEXT,
      categoria_es TEXT NOT NULL,
      categoria_en TEXT NOT NULL,
      precio_mxn INTEGER NOT NULL,
      precio_usd REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      peso_kg REAL,
      imagenes TEXT DEFAULT '[]',
      destacado INTEGER DEFAULT 0,
      activo INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      nombre TEXT,
      pais TEXT NOT NULL,
      direccion TEXT,
      moneda TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      costo_envio INTEGER NOT NULL,
      total INTEGER NOT NULL,
      payment_provider TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      stripe_session_id TEXT,
      paypal_order_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      precio_unitario INTEGER NOT NULL
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `)

  const count = db.prepare('SELECT COUNT(*) as count FROM settings').get() as any
  if (count.count === 0) {
    const insert = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)')
    const defaults = [
      ['shipping_mx_mxn', '150'],
      ['shipping_us_usd', '2500'],
      ['shipping_ca_usd', '3000'],
      ['shipping_eu_usd', '4000'],
      ['whatsapp_number', '521234567890'],
      ['store_email', 'ventas@tlalchichi.mx'],
      ['admin_secret', 'admin123'],
    ]
    for (const [key, value] of defaults) {
      insert.run(key, value)
    }
  }
}

function seedProductsForce() {
  const db = _db!
  if (seedProducts.length === 0) {
    console.log('[seed] No hay productos en seed.json')
    return
  }

  console.log('[seed] Forzando resiembra de', seedProducts.length, 'productos...')

  // Siempre resiembra los productos desde seed.json
  try {
    db.exec('DELETE FROM products')
    try { db.exec("DELETE FROM sqlite_sequence WHERE name='products'") } catch(e) {}
    console.log('[seed] Productos viejos eliminados')
  } catch (e) {
    console.error('[seed] Error al eliminar productos:', e)
    return
  }

  const insert = db.prepare(`
    INSERT INTO products (slug, nombre_es, nombre_en, descripcion_es, descripcion_en, historia_es, historia_en, categoria_es, categoria_en, precio_mxn, precio_usd, stock, peso_kg, imagenes, destacado, activo)
    VALUES (@slug, @nombre_es, @nombre_en, @descripcion_es, @descripcion_en, @historia_es, @historia_en, @categoria_es, @categoria_en, @precio_mxn, @precio_usd, @stock, @peso_kg, @imagenes, @destacado, 1)
  `)

  let inserted = 0
  for (const product of seedProducts) {
    try {
      insert.run({
        ...product,
        imagenes: JSON.stringify(product.imagenes),
        destacado: product.destacado ? 1 : 0,
      })
      inserted++
    } catch (e) {
      console.error('[seed] Error insertando producto', product.slug, ':', e)
    }
  }
  console.log('[seed] Insertados', inserted, 'de', seedProducts.length, 'productos')
}

export function getProducts(opts?: { destacado?: boolean; categoria?: string; slug?: string; activo?: boolean }): any[] {
  const db = getDb()
  let sql = 'SELECT * FROM products WHERE 1=1'
  const params: any[] = []

  if (opts?.slug) {
    sql += ' AND slug = ?'
    params.push(opts.slug)
  }
  if (opts?.activo !== undefined) {
    sql += ' AND activo = ?'
    params.push(opts.activo ? 1 : 0)
  }
  if (opts?.destacado !== undefined) {
    sql += ' AND destacado = ?'
    params.push(opts.destacado ? 1 : 0)
  }
  if (opts?.categoria) {
    sql += ' AND (categoria_es = ? OR categoria_en = ?)'
    params.push(opts.categoria, opts.categoria)
  }

  sql += ' ORDER BY id ASC'
  const rows = db.prepare(sql).all(...params) as any[]
  return rows.map(normalizeProduct)
}

export function getProductBySlug(slug: string): any | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM products WHERE slug = ? AND activo = 1').get(slug) as any
  return row ? normalizeProduct(row) : null
}

export function getCategories(locale: string): string[] {
  const db = getDb()
  const col = locale === 'es' ? 'categoria_es' : 'categoria_en'
  const rows = db.prepare(`SELECT DISTINCT ${col} as cat FROM products WHERE activo = 1 ORDER BY ${col}`).all() as any[]
  return rows.map((r: any) => r.cat).filter(Boolean)
}

function normalizeProduct(row: any): any {
  return {
    ...row,
    imagenes: typeof row.imagenes === 'string' ? JSON.parse(row.imagenes) : row.imagenes || [],
    destacado: !!row.destacado,
    activo: !!row.activo,
  }
}

export function createOrder(data: {
  email: string
  nombre?: string
  pais: string
  direccion?: string
  moneda: string
  subtotal: number
  costo_envio: number
  total: number
  payment_provider: string
  payment_status: string
  stripe_session_id?: string
  paypal_order_id?: string
}): any {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO orders (email, nombre, pais, direccion, moneda, subtotal, costo_envio, total, payment_provider, payment_status, stripe_session_id, paypal_order_id)
    VALUES (@email, @nombre, @pais, @direccion, @moneda, @subtotal, @costo_envio, @total, @payment_provider, @payment_status, @stripe_session_id, @paypal_order_id)
  `)
  const result = stmt.run(data)
  return db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid)
}

export function createOrderItems(items: { order_id: number; product_id: number; quantity: number; precio_unitario: number }[]) {
  const db = getDb()
  const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, precio_unitario) VALUES (@order_id, @product_id, @quantity, @precio_unitario)')
  for (const item of items) {
    stmt.run(item)
  }
}

export function decrementStock(productId: number, quantity: number) {
  const db = getDb()
  db.prepare('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ? AND stock >= ?').run(quantity, productId, quantity)
}

export function upsertProduct(data: any): any {
  const db = getDb()
  const exists = db.prepare('SELECT id FROM products WHERE slug = ?').get(data.slug) as any
  if (exists) {
    db.prepare(`
      UPDATE products SET nombre_es=@nombre_es, nombre_en=@nombre_en, descripcion_es=@descripcion_es, descripcion_en=@descripcion_en, historia_es=@historia_es, historia_en=@historia_en, categoria_es=@categoria_es, categoria_en=@categoria_en, precio_mxn=@precio_mxn, precio_usd=@precio_usd, stock=@stock, peso_kg=@peso_kg, imagenes=@imagenes, destacado=@destacado, activo=@activo
      WHERE id = @id
    `).run(data)
    return db.prepare('SELECT * FROM products WHERE id = ?').get(exists.id)
  } else {
    const result = db.prepare(`
      INSERT INTO products (slug, nombre_es, nombre_en, descripcion_es, descripcion_en, historia_es, historia_en, categoria_es, categoria_en, precio_mxn, precio_usd, stock, peso_kg, imagenes, destacado, activo)
      VALUES (@slug, @nombre_es, @nombre_en, @descripcion_es, @descripcion_en, @historia_es, @historia_en, @categoria_es, @categoria_en, @precio_mxn, @precio_usd, @stock, @peso_kg, @imagenes, @destacado, @activo)
    `).run(data)
    return db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid)
  }
}

export function deleteProduct(id: number) {
  const db = getDb()
  db.prepare('DELETE FROM products WHERE id = ?').run(id)
}

export function getOrders(): any[] {
  const db = getDb()
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all() as any[]
  return orders.map((o) => ({
    ...o,
    direccion: o.direccion ? JSON.parse(o.direccion) : null,
  }))
}

export function getOrderItems(orderId: number): any[] {
  const db = getDb()
  return db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId)
}

export function getSetting(key: string): string | null {
  const db = getDb()
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as any
  return row?.value || null
}

export function setSetting(key: string, value: string) {
  const db = getDb()
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value)
}
