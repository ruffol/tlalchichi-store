'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Product, ShippingDestination } from '@/types'
import { SHIPPING_RATES } from '@/types'

interface CartState {
  items: CartItem[]
  pais: ShippingDestination
  isOpen: boolean
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setPais: (pais: ShippingDestination) => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      pais: 'MX' as ShippingDestination,
      isOpen: false,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          return { items: [...state.items, { product, quantity }] }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.product.id !== productId)
              : state.items.map((item) =>
                  item.product.id === productId ? { ...item, quantity } : item
                ),
        })),

      clearCart: () => set({ items: [] }),
      setPais: (pais) => set({ pais }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'tlalchichi-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        pais: state.pais,
      }),
    }
  )
)

export function getSubtotal(items: CartItem[], moneda: 'MXN' | 'USD'): number {
  const key = moneda === 'MXN' ? 'precio_mxn' : 'precio_usd'
  return items.reduce((total, item) => total + item.product[key] * item.quantity, 0)
}

export function getShippingCost(
  pais: ShippingDestination,
  moneda: 'MXN' | 'USD'
): number {
  return SHIPPING_RATES[pais]?.[moneda] ?? 0
}

export function getTotal(
  items: CartItem[],
  pais: ShippingDestination,
  moneda: 'MXN' | 'USD'
): number {
  return getSubtotal(items, moneda) + getShippingCost(pais, moneda)
}

export function getItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}
