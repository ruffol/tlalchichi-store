'use client'

import { useTranslations } from 'next-intl'
import { useCartStore, getSubtotal, getItemCount, getTotal, getShippingCost } from '@/store/cart'
import { Link } from '@/i18n/routing'
import { useEffect } from 'react'
import { SHIPPING_RATES, type ShippingDestination } from '@/types'

export default function CartDrawer() {
  const t = useTranslations('Cart')
  const { items, isOpen, closeCart, pais, setPais, removeItem, updateQuantity } = useCartStore()
  const count = getItemCount(items)
  const subtotal = getSubtotal(items, pais === 'MX' ? 'MXN' : 'USD')
  const shipping = getShippingCost(pais, pais === 'MX' ? 'MXN' : 'USD')
  const total = subtotal + shipping
  const moneda = pais === 'MX' ? 'MXN' : 'USD'

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const shippingOptions = (Object.entries(SHIPPING_RATES) as [ShippingDestination, typeof SHIPPING_RATES[ShippingDestination]][]).map(
    ([key, val]) => ({
      value: key,
      label: `${val.label_es} — ${moneda === 'MXN' && val.MXN > 0 ? `$${val.MXN} MXN` : val.USD > 0 ? `$${val.USD / 100} USD` : 'Gratis'}`,
    })
  )

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={closeCart} />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-arena">
              <h2 className="text-lg font-semibold">
                {t('titulo')} ({count})
              </h2>
              <button onClick={closeCart} className="p-2 text-negro-suave/60 hover:text-negro-suave">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <p className="text-negro-suave/50 mb-2">{t('vacio')}</p>
                <p className="text-sm text-negro-suave/40 mb-6">{t('vacio_desc')}</p>
                <button
                  onClick={closeCart}
                  className="text-sm text-terracota hover:text-terracota-dark font-medium"
                >
                  {t('seguir')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {items.map((item) => {
                    const precio = moneda === 'MXN' ? item.product.precio_mxn : item.product.precio_usd
                    return (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="w-20 h-20 bg-arena rounded-xl flex-shrink-0 overflow-hidden">
                          {item.product.imagen_principal && (
                            <img
                              src={item.product.imagen_principal}
                              alt={item.product.nombre_es}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.product.nombre_es}</p>
                          <p className="text-sm text-negro-suave/60 mt-1">
                            {moneda === 'MXN' ? `$${precio} MXN` : `$${(precio / 100).toFixed(2)} USD`}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full border border-arena flex items-center justify-center text-sm hover:bg-arena"
                            >
                              -
                            </button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full border border-arena flex items-center justify-center text-sm hover:bg-arena"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-negro-suave/30 hover:text-red-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-arena p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-negro-suave/60 mb-1">
                      {t('seleccionar_pais')}
                    </label>
                    <select
                      value={pais}
                      onChange={(e) => setPais(e.target.value as ShippingDestination)}
                      className="w-full px-3 py-2 rounded-xl border border-arena bg-white text-sm"
                    >
                      {shippingOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-negro-suave/60">{t('subtotal')}</span>
                      <span>{moneda === 'MXN' ? `$${subtotal} MXN` : `$${(subtotal / 100).toFixed(2)} USD`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-negro-suave/60">{t('envio')}</span>
                      <span>{shipping === 0 ? 'Gratis' : moneda === 'MXN' ? `$${shipping} MXN` : `$${(shipping / 100).toFixed(2)} USD`}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-arena">
                      <span>{t('total')}</span>
                      <span>{moneda === 'MXN' ? `$${total} MXN` : `$${(total / 100).toFixed(2)} USD`}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full text-center bg-terracota text-white py-3 rounded-xl font-medium hover:bg-terracota-dark transition-colors"
                  >
                    {t('pagar')}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
