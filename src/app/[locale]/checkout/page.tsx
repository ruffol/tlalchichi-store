'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useCartStore, getSubtotal, getTotal, getItemCount } from '@/store/cart'
import { SHIPPING_RATES, type ShippingDestination } from '@/types'
import { useState } from 'react'
import { Link } from '@/i18n/routing'
import { useRouter } from '@/i18n/routing'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

export default function CheckoutPage() {
  const t = useTranslations('Checkout')
  const ct = useTranslations('Cart')
  const locale = useLocale()
  const router = useRouter()
  const { items, pais, setPais, clearCart } = useCartStore()
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

  const handleStripeClick = async () => {
    const formError = validateForm()
    if (formError) { setError(formError); return }
    setError('')
    setLoading('stripe')
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
      if (!res.ok) throw new Error(data.error || 'Error al crear el pago')
      if (data.url) window.location.href = data.url
      else throw new Error('No se recibio la URL de pago')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago')
      setLoading(null)
    }
  }

  const handleStripeSuccess = () => {
    clearCart()
    router.push(`/checkout/success`)
  }

  const handlePayPal = async () => {
    const formError = validateForm()
    if (formError) { setError(formError); return }
    setLoading('paypal')
    setError('')
    // Guardar email para la pagina de exito
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tlalchichi_email', form.email)
    }
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
          direccion_linea: form.direccion,
          ciudad: form.ciudad,
          estado: form.estado,
          cp: form.cp,
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
          {loading === 'stripe' ? (
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium text-white transition-colors opacity-70"
              style={{ background: 'linear-gradient(135deg, #635BFF, #0A2540)' }}
            >
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Redirigiendo a Stripe...
              </span>
            </button>
          ) : (
            <button
              onClick={handleStripeClick}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium text-white transition-colors hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #635BFF, #0A2540)' }}
            >
              <svg viewBox="0 0 48 20" className="w-10 h-4" fill="white">
                <path d="M40.7 0C37.7 0 34.2 1.5 33 5.1c1.6-.5 3.1-.6 4.2-.6 2.3 0 4.3.6 5.8 1.8-1 3-3.7 5.2-7 5.2-.6 0-1.2-.1-1.7-.2l-.6 2.2c.7.1 1.5.2 2.3.2 4.5 0 8.3-2.8 9.7-7.1.5-1.6.7-3 .7-4.2C47.4.7 44.9 0 40.7 0zM33.3 12.2c-.3 0-.6-.1-.9-.2.1-.4.2-.8.3-1.2 1.2-4.9 5.5-8.6 10.5-8.6h.1c-.7-1.3-2-2.2-3.6-2.2-2.3 0-4.2 1.8-4.6 4.1-.2 1.2.3 2.4 1.3 3.1-.8.3-1.7.5-2.6.5.7.3 1.3.9 1.5 1.7.2.8 0 1.7-.6 2.3-.3.3-.7.5-1.2.5z"/>
              </svg>
              Pagar con Stripe
            </button>
          )}
          <button
            onClick={handlePayPal}
            disabled={loading === 'paypal'}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium bg-[#0070BA] hover:bg-[#003087] text-white transition-colors disabled:opacity-50"
          >
            {loading === 'paypal' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Procesando...
              </span>
            ) : (
              <>
                <svg viewBox="0 0 48 30" className="w-10 h-5" fill="white">
                  <path d="M37.5 0C28.2 0 21.4 5.5 19.3 13.5c-1.1 4.2-2.1 8.4-3.2 12.6-.6 2.3.5 4.5 2.7 5.3 2.2.8 4.5.1 5.8-1.8.9-1.3 1.7-2.7 2.5-4.1 2.5-4.3 5-8.6 7.5-12.9 1.5-2.6 3.4-4.9 6.3-5.9 3.5-1.2 6.9-.5 9.7 2 2.5 2.2 3.7 5.1 3.5 8.5-.2 3.7-1.9 6.7-4.9 8.8-3.2 2.2-6.7 2.8-10.3 1.8-2.5-.7-4.3-2.4-5.2-4.9-.3-.9-.2-1.8.1-2.7.5-1.4 1.2-2.7 1.8-4.1.4-.9.7-1.8.6-2.8-.1-1.2-.8-2.1-1.9-2.6-1.4-.6-2.8-.4-4.1.2-1.4.6-2.2 1.7-2.6 3.1-.4 1.4-.2 2.8.3 4.1.5 1.3 1.3 2.4 2.2 3.3.2.2.3.5.2.8-.6 2.4-1.2 4.8-1.8 7.2-.2.7-.5 1.4-.7 2.1-.2.6-.1 1.2.3 1.7.5.6 1.2.9 2 .9h.1c1.4 0 2.6-.8 3.2-2.1.6-1.4 1.1-2.8 1.6-4.2.2-.5.4-1.1.5-1.6.3-1.2.8-2.3 1.6-3.3.8-.9 1.8-1.5 3.1-1.7 1.1-.2 2.1 0 3.1.4 4.1 1.7 5.9 5.4 5.6 9.8-.4 5.3-4.1 9.1-9.2 10.4-5.3 1.4-10.2-.1-13.8-3.9-3.1-3.3-4.4-7.4-3.2-11.8.3-1.1.7-2.2 1.2-3.2.4-.9.9-1.8 1.3-2.7.2-.4.3-.8.2-1.2-.1-.5-.4-.9-.8-1.1-.7-.4-1.4-.4-2.1-.1-.5.2-.9.6-1.1 1.1-1.5 3-2.9 6.1-4.4 9.1-1.7 3.4-3.4 6.8-5.1 10.2-.5 1-.7 2.1-.6 3.2.1 1.5.7 2.8 1.7 3.9 2.3 2.5 5.3 3.8 8.6 3.9 4.8.3 9.2-1.1 12.9-4.1 3.4-2.7 5.6-6.4 6.5-10.7.4-1.8.5-3.7.3-5.5-.3-2.5-1.2-4.8-2.7-6.8-2.5-3.4-6-5.3-10.2-5.7-1.7-.2-3.4-.1-5.1.3-1.1.3-2.2.7-3.4 1.1.6-2.3 1.5-4.3 2.9-6 1.7-2.1 3.8-3.5 6.3-4.3 2.6-.8 5.3-1 7.9-.5 2.3.5 4.2 1.6 5.8 3.2 1.3 1.3 2.2 2.8 2.9 4.5.1.2.3.4.5.5.3.1.6.1.8 0 .5-.3.8-.8.7-1.4-.1-.7-.3-1.3-.5-1.9-1.7-4.1-4.8-6.6-8.8-8-.7-.2-1.4-.4-2.1-.5-1.6-.3-3.2-.3-4.8-.1-3.8.6-7 2.4-9.6 5.5"/>
                </svg>
                Pagar con PayPal
              </>
            )}
          </button>
        </div>

        {/* Contacto */}
        <div className="text-center pt-6 border-t border-arena">
          <p className="text-xs text-muted mb-3">¿Tienes dudas antes de pagar?</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://wa.me/523121337694"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted hover:text-terracota transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
              </svg>
              WhatsApp
            </a>
            <a
              href="mailto:srtlalchichi@gmail.com"
              className="flex items-center gap-2 text-sm text-muted hover:text-terracota transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              srtlalchichi@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
