import { NextResponse } from 'next/server'
import { getOrders, getOrderItems } from '@/lib/db'

export async function GET() {
  const orders = getOrders()
  const ordersWithItems = orders.map((order: any) => ({
    ...order,
    items: getOrderItems(order.id),
  }))
  return NextResponse.json(ordersWithItems)
}
