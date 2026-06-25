'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import Button from '@/components/ui/Button'

interface Props {
  items: any[]
  pais: string
  moneda: string
  form: { email: string; nombre: string; direccion: string; ciudad: string; estado: string; cp: string }
  shipping: number
  total: number
  onSuccess: () => void
}

export default function StripePaymentForm({ items, pais, moneda, form, shipping, total, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      if (!publishableKey) {
        throw new Error('Stripe no está configurado. Contacta al administrador.')
      }

      const stripe = await loadStripe(publishableKey)

      const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            nombre: i.nombre,
            precio: i.precio,
            quantity: i.quantity,
            imagen: i.imagen,
          })),
          pais,
          moneda,
          email: form.email,
          nombre: form.nombre,
          direccion: `${form.direccion}, ${form.ciudad}, ${form.estado}, ${form.cp}`,
          shipping,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear el pago')

      const result = await stripe!.redirectToCheckout({ sessionId: data.id })
      if (result.error) throw new Error(result.error.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago')
      setLoading(false)
    }
  }

  return (
    <div>
      <Button
        onClick={handlePayment}
        loading={loading}
        size="lg"
        className="w-full flex items-center justify-center gap-2"
      >
        <svg viewBox="0 0 48 20" className="w-10 h-4" fill="white">
          <path d="M40.7 0C37.7 0 34.2 1.5 33 5.1c1.6-.5 3.1-.6 4.2-.6 2.3 0 4.3.6 5.8 1.8-1 3-3.7 5.2-7 5.2-.6 0-1.2-.1-1.7-.2l-.6 2.2c.7.1 1.5.2 2.3.2 4.5 0 8.3-2.8 9.7-7.1.5-1.6.7-3 .7-4.2C47.4.7 44.9 0 40.7 0zM33.3 12.2c-.3 0-.6-.1-.9-.2.1-.4.2-.8.3-1.2 1.2-4.9 5.5-8.6 10.5-8.6h.1c-.7-1.3-2-2.2-3.6-2.2-2.3 0-4.2 1.8-4.6 4.1-.2 1.2.3 2.4 1.3 3.1-.8.3-1.7.5-2.6.5.7.3 1.3.9 1.5 1.7.2.8 0 1.7-.6 2.3-.3.3-.7.5-1.2.5z" />
        </svg>
        Pagar con Stripe
      </Button>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}
