import { NextResponse } from 'next/server'
import { getDb, getProducts, upsertProduct, deleteProduct } from '@/lib/db'

export async function GET() {
  const products = getProducts()
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const data = await req.json()
  const product = upsertProduct({
    ...data,
    imagenes: data.imagenes ? JSON.stringify(data.imagenes) : '[]',
    destacado: data.destacado ? 1 : 0,
    activo: data.activo !== undefined ? (data.activo ? 1 : 0) : 1,
  })
  return NextResponse.json(product)
}

export async function PUT(req: Request) {
  const data = await req.json()
  const product = upsertProduct({
    ...data,
    imagenes: data.imagenes ? JSON.stringify(data.imagenes) : '[]',
    destacado: data.destacado ? 1 : 0,
  })
  return NextResponse.json(product)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  deleteProduct(id)
  return NextResponse.json({ success: true })
}
