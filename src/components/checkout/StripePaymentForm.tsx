'use client'

import { useState, useEffect, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Button from '@/components/ui/Button'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface StripePaymentFormProps {
  items: { id: string | number; nombre: string; precio: number; quantity: number; imagen?: string | null }[]
  pais: string
  moneda: string
  form: { email: string; nombre: string; direccion: string; ciudad: string; estado: string; cp: string }
  shipping: number
  total: number
  onSuccess: () => void
}

function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message || 'Error al procesar el pago')
      setLoading(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess()
    } else {
      setError('El pago no se completó')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}
      <Button type="submit" disabled={!stripe || loading} loading={loading} size="lg" className="w-full">
        Pagar
      </Button>
    </form>
  )
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState('')
  const [error, setError] = useState('')

  const body = useMemo(() => ({
    items: props.items.map((i) => ({
      id: i.id,
      nombre: i.nombre,
      precio: i.precio,
      quantity: i.quantity,
      imagen: i.imagen,
    })),
    pais: props.pais,
    moneda: props.moneda,
    email: props.form.email,
    nombre: props.form.nombre,
    direccion: `${props.form.direccion}, ${props.form.ciudad}, ${props.form.estado}, ${props.form.cp}`,
    shipping: props.shipping,
    total: props.total,
  }), [props.items, props.pais, props.moneda, props.form, props.shipping, props.total])

  useEffect(() => {
    fetch('/api/checkout/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret)
        else setError(data.error || 'Error al iniciar pago')
      })
      .catch((err) => setError(err.message))
  }, [body])

  const handleSuccess = async () => {
    try {
      const res = await fetch('/api/checkout/confirm-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: clientSecret ? clientSecret.split('_secret_')[0] : '',
          items: props.items,
          pais: props.pais,
          moneda: props.moneda,
          form: props.form,
          shipping: props.shipping,
          total: props.total,
        }),
      })
      if (!res.ok) {
        setError('Error al confirmar la orden')
        return
      }
      props.onSuccess()
    } catch {
      setError('Error al confirmar la orden')
    }
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
        {error}
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="bg-arena/30 rounded-2xl p-6 animate-pulse">
        <div className="h-10 bg-arena rounded-xl" />
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
      <PaymentForm onSuccess={handleSuccess} />
    </Elements>
  )
}
