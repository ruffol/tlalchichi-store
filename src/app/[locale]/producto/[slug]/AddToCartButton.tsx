'use client'

import { useTranslations } from 'next-intl'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/types'
import Button from '@/components/ui/Button'
import { useState } from 'react'

interface Props {
  product: Product
}

export default function AddToCartButton({ product }: Props) {
  const t = useTranslations('ProductDetail')
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const [added, setAdded] = useState(false)

  const handleClick = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    openCart()
  }

  return (
    <Button
      onClick={handleClick}
      disabled={product.stock <= 0}
      size="lg"
      className="flex-1"
    >
      {product.stock <= 0
        ? t('sin_stock')
        : added
        ? t('agregado')
        : t('agregar')}
    </Button>
  )
}
