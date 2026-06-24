'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

export default function AdminOrdenesPage() {
  const t = useTranslations('Admin')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((data) => {
        setOrders(data || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="text-center py-12">{t('cargando')}</p>
  if (orders.length === 0) return <p className="text-center py-12 text-negro-suave/40">{t('sin_ordenes')}</p>

  return (
    <div className="space-y-4">
      {orders.map((order: any) => (
        <div key={order.id} className="p-6 bg-white rounded-xl border border-arena">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-semibold">{order.nombre || '—'}</p>
              <p className="text-sm text-negro-suave/40">{order.email}</p>
              <p className="text-xs text-negro-suave/30 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${order.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {order.payment_status}
              </span>
              <p className="text-sm font-medium mt-1">
                {order.moneda === 'MXN' ? `$${order.total} MXN` : `$${(order.total / 100).toFixed(2)} USD`}
              </p>
            </div>
          </div>
          <div className="text-xs text-negro-suave/40">
            <p>Pago: {order.payment_provider}</p>
            {order.direccion && <p>Envío: {typeof order.direccion === 'string' ? order.direccion : JSON.stringify(order.direccion)}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
