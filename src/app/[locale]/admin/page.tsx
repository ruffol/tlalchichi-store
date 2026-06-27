'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect, useMemo } from 'react'
import type { Product, ProductFormData } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ImageUploader from '@/components/admin/ImageUploader'

const emptyForm = (): ProductFormData & { imagenes: string[] } => ({
  slug: '',
  nombre_es: '',
  nombre_en: '',
  descripcion_es: '',
  descripcion_en: '',
  historia_es: '',
  historia_en: '',
  categoria_es: '',
  categoria_en: '',
  precio_mxn: 0,
  precio_usd: 0,
  stock: 0,
  peso_kg: 0,
  imagenes: [],
})

type AdminProduct = Product & { imagenes: string[] }

export default function AdminProductosPage() {
  const t = useTranslations('Admin')
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error' })
  const [errors, setErrors] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm())

  function authHeaders(): Record<string, string> {
    const token = sessionStorage.getItem('admin_token')
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
  }

  async function loadProducts() {
    const res = await fetch('/api/admin/products', { headers: authHeaders() })
    const data = await res.json()
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    const headers = authHeaders()
    fetch('/api/admin/products', { headers })
      .then((r) => r.json())
      .then((data) => {
        setProducts(data || [])
        setLoading(false)
      })
  }, [])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    setErrors([])
    const res = await fetch('/api/admin/products', {
      method: editing ? 'PUT' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify(editing ? { ...form, id: editing, imagen_principal: form.imagenes[0] || '' } : { ...form, imagen_principal: form.imagenes[0] || '' }),
    })
    const data = await res.json()
    if (res.ok) {
      showToast(editing ? t('guardado') : t('creado'))
      setEditing(null)
      setForm(emptyForm())
      loadProducts()
    } else {
      setErrors(data.errors || ['Error al guardar'])
    }
    setSaving(false)
  }

  const handleEdit = (p: AdminProduct) => {
    setEditing(p.id as unknown as number)
    setErrors([])
    setForm({
      slug: p.slug,
      nombre_es: p.nombre_es,
      nombre_en: p.nombre_en,
      descripcion_es: p.descripcion_es || '',
      descripcion_en: p.descripcion_en || '',
      historia_es: p.historia_es || '',
      historia_en: p.historia_en || '',
      categoria_es: p.categoria_es,
      categoria_en: p.categoria_en,
      precio_mxn: p.precio_mxn,
      precio_usd: p.precio_usd,
      stock: p.stock,
      peso_kg: p.peso_kg || 0,
      imagenes: p.imagenes || [],
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar producto?')) return
    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: authHeaders(),
      body: JSON.stringify({ id }),
    })
    loadProducts()
    showToast('Producto eliminado')
  }

  const filteredProducts = useMemo(
    () => products.filter((p) => {
      if (!search) return true
      const q = search.toLowerCase()
      return p.nombre_es?.toLowerCase().includes(q)
        || p.nombre_en?.toLowerCase().includes(q)
        || p.slug?.toLowerCase().includes(q)
        || p.categoria_es?.toLowerCase().includes(q)
    }),
    [products, search],
  )

  if (loading) return <p className="text-center py-12 text-muted">{t('cargando')}</p>

  return (
    <div>
      {toast.message && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm animate-fade-in ${
          toast.type === 'success' ? 'bg-terracota text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="bg-card rounded-xl border border-arena p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">
          {editing ? `${t('editar')}: ${form.nombre_es}` : t('nuevo_producto')}
        </h2>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Errores:</p>
            <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300 space-y-0.5">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Información básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="ej: tlalchichi-sentado" />
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t('nombre_es')} value={form.nombre_es} onChange={(e) => setForm({ ...form, nombre_es: e.target.value })} />
                <Input label={t('nombre_en')} value={form.nombre_en} onChange={(e) => setForm({ ...form, nombre_en: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="border-t border-arena pt-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Precios y stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input label={t('precio_mxn')} type="number" value={form.precio_mxn} onChange={(e) => setForm({ ...form, precio_mxn: parseInt(e.target.value) || 0 })} />
              <Input label={t('precio_usd')} type="number" step="0.01" value={form.precio_usd} onChange={(e) => setForm({ ...form, precio_usd: parseFloat(e.target.value) || 0 })} />
              <Input label={t('stock')} type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
              <Input label={t('peso_kg')} type="number" step="0.01" value={form.peso_kg} onChange={(e) => setForm({ ...form, peso_kg: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>

          <div className="border-t border-arena pt-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Categoría</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={t('categoria_es')} value={form.categoria_es} onChange={(e) => setForm({ ...form, categoria_es: e.target.value })} placeholder="ej: Esculturas" />
              <Input label={t('categoria_en')} value={form.categoria_en} onChange={(e) => setForm({ ...form, categoria_en: e.target.value })} placeholder="ej: Sculptures" />
            </div>
          </div>

          <div className="border-t border-arena pt-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Contenido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-negro-suave mb-1.5">{t('descripcion_es')}</label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border border-arena bg-card text-foreground placeholder:text-muted resize-none h-24 focus:outline-none focus:ring-2 focus:ring-terracota/50 focus:border-terracota transition-colors"
                  value={form.descripcion_es}
                  onChange={(e) => setForm({ ...form, descripcion_es: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-negro-suave mb-1.5">{t('descripcion_en')}</label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border border-arena bg-card text-foreground placeholder:text-muted resize-none h-24 focus:outline-none focus:ring-2 focus:ring-terracota/50 focus:border-terracota transition-colors"
                  value={form.descripcion_en}
                  onChange={(e) => setForm({ ...form, descripcion_en: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-negro-suave mb-1.5">{t('historia_es')}</label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border border-arena bg-card text-foreground placeholder:text-muted resize-none h-24 focus:outline-none focus:ring-2 focus:ring-terracota/50 focus:border-terracota transition-colors"
                  value={form.historia_es}
                  onChange={(e) => setForm({ ...form, historia_es: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-negro-suave mb-1.5">{t('historia_en')}</label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border border-arena bg-card text-foreground placeholder:text-muted resize-none h-24 focus:outline-none focus:ring-2 focus:ring-terracota/50 focus:border-terracota transition-colors"
                  value={form.historia_en}
                  onChange={(e) => setForm({ ...form, historia_en: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-arena pt-6">
            <ImageUploader
              images={form.imagenes}
              onChange={(imagenes) => setForm({ ...form, imagenes })}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-arena">
          <Button onClick={handleSave} loading={saving}>{t('guardar')}</Button>
          {editing && (
            <Button variant="ghost" onClick={() => { setEditing(null); setForm(emptyForm()); setErrors([]) }}>
              {t('cancelar')}
            </Button>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <h2 className="text-xl font-semibold">{t('productos')} ({filteredProducts.length})</h2>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl border border-arena bg-card text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-terracota/50 w-full sm:w-64"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center py-12 text-muted">
            {search ? 'Sin resultados' : 'No hay productos'}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-arena">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-arena text-left text-muted text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium w-12"></th>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Precio MXN</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Precio USD</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 font-medium w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-arena">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="bg-card hover:bg-arena/30 transition-colors">
                    <td className="px-4 py-3">
                      {p.imagenes?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imagenes[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-arena flex items-center justify-center text-muted text-xs">—</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{p.nombre_es}</td>
                    <td className="px-4 py-3 whitespace-nowrap">${p.precio_mxn}</td>
                    <td className="px-4 py-3 whitespace-nowrap">${p.precio_usd}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 ${p.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{p.categoria_es}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-terracota text-white hover:bg-terracota-dark transition-colors"
                        >
                          {t('editar')}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          {t('eliminar')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
