'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useCartStore, getSubtotal, getTotal, getItemCount } from '@/store/cart'
import { SHIPPING_RATES, type ShippingDestination } from '@/types'
import { useState } from 'react'
import { Link } from '@/i18n/routing'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

export default function CheckoutPage() {
  const t = useTranslations('Checkout')
  const ct = useTranslations('Cart')
  const locale = useLocale()
  const { items, pais, setPais } = useCartStore()
  const count = getItemCount(items)
  const moneda = pais === 'MX' ? 'MXN' : 'USD'
  const subtotal = getSubtotal(items, moneda)
  const total = getTotal(items, pais, moneda)
  const [loading, setLoading] = useState<'stripe' | 'paypal' | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', nombre: '', direccion: '', ciudad: '', estado: '', cp: '' })

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-negro-suave/50 mb-4">{ct('vacio')}</p>
        <Link href="/productos" className="text-terracota hover:text-terracota-dark font-medium">
          {ct('seguir')}
        </Link>
      </div>
    )
  }

  const shippingOptions = (Object.entries(SHIPPING_RATES) as [ShippingDestination, typeof SHIPPING_RATES[ShippingDestination]][]).map(
    ([key, val]) => ({
      value: key,
      label: val.label_es,
    })
  )

  function validateForm(): string | null {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return t('email_invalido')
    if (!form.nombre.trim()) return t('nombre_requerido')
    if (!form.direccion.trim()) return t('direccion_requerida')
    if (!form.ciudad.trim()) return t('ciudad_requerida')
    if (!form.estado.trim()) return t('estado_requerido')
    if (!form.cp.trim()) return t('cp_requerido')
    return null
  }

  const handleStripe = async () => {
    const formError = validateForm()
    if (formError) { setError(formError); return }
    setLoading('stripe')
    setError('')
    try {
      const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.product.id,
            nombre: i.product.nombre_es,
            precio: moneda === 'MXN' ? i.product.precio_mxn : i.product.precio_usd,
            quantity: i.quantity,
            imagen: i.product.imagen_principal,
          })),
          pais,
          moneda,
          email: form.email,
          nombre: form.nombre,
          direccion: `${form.direccion}, ${form.ciudad}, ${form.estado}, ${form.cp}`,
          shipping: getSubtotal(items, moneda) > 0 ? total - subtotal : 0,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al procesar el pago')
      window.location.assign(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago')
      setLoading(null)
    }
  }

  const handlePayPal = async () => {
    const formError = validateForm()
    if (formError) { setError(formError); return }
    setLoading('paypal')
    setError('')
    try {
      const res = await fetch('/api/checkout/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.product.id,
            nombre: i.product.nombre_es,
            precio: moneda === 'MXN' ? i.product.precio_mxn : i.product.precio_usd,
            quantity: i.quantity,
            imagen: i.product.imagen_principal,
          })),
          pais,
          moneda,
          email: form.email,
          nombre: form.nombre,
          direccion: `${form.direccion}, ${form.ciudad}, ${form.estado}, ${form.cp}`,
          shipping: getSubtotal(items, moneda) > 0 ? total - subtotal : 0,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al procesar el pago')
      if (data.approvalUrl) window.location.href = data.approvalUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago')
      setLoading(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-negro-suave mb-8">{t('titulo')}</h1>

      <div className="space-y-6">
        <Input
          label={t('email')}
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="correo@ejemplo.com"
        />
        <Input
          label={t('nombre')}
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        <Input
          label={t('direccion')}
          value={form.direccion}
          onChange={(e) => setForm({ ...form, direccion: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t('ciudad')}
            value={form.ciudad}
            onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
          />
          <Input
            label={t('estado')}
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
          />
        </div>
        <Input
          label={t('codigo_postal')}
          value={form.cp}
          onChange={(e) => setForm({ ...form, cp: e.target.value })}
        />
        <Select
          label={t('pais')}
          value={pais}
          onChange={(e) => setPais(e.target.value as ShippingDestination)}
          options={shippingOptions}
        />

        <div className="bg-arena/30 rounded-2xl p-6 space-y-3">
          <h3 className="font-semibold">{ct('resumen')}</h3>
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span>{locale === 'es' ? item.product.nombre_es : item.product.nombre_en} x{item.quantity}</span>
              <span>
                {moneda === 'MXN'
                  ? `$${item.product.precio_mxn * item.quantity} MXN`
                  : `$${(item.product.precio_usd * item.quantity).toFixed(2)} USD`}
              </span>
            </div>
          ))}
          <div className="border-t border-arena pt-3 space-y-1">
            <div className="flex justify-between text-sm text-negro-suave/60">
              <span>{ct('subtotal')}</span>
              <span>{moneda === 'MXN' ? `$${subtotal} MXN` : `$${subtotal.toFixed(2)} USD`}</span>
            </div>
            <div className="flex justify-between text-sm text-negro-suave/60">
              <span>{ct('envio')}</span>
              <span>
                {total - subtotal === 0
                  ? 'Gratis'
                  : moneda === 'MXN'
                  ? `$${total - subtotal} MXN`
                  : `$${(total - subtotal).toFixed(2)} USD`}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-arena">
              <span>{ct('total')}</span>
              <span>{moneda === 'MXN' ? `$${total} MXN` : `$${total.toFixed(2)} USD`}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleStripe}
            loading={loading === 'stripe'}
            size="lg"
            className="w-full"
          >
            {ct('checkout_stripe')}
          </Button>
          <Button
            onClick={handlePayPal}
            loading={loading === 'paypal'}
            variant="outline"
            size="lg"
            className="w-full"
          >
            {ct('checkout_paypal')}
          </Button>
        </div>
      </div>
    </div>
  )
}
