'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import type { ProductFormData } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ImageUploader from '@/components/admin/ImageUploader'

export default function AdminProductosPage() {
  const t = useTranslations('Admin')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<number | null>(null)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState<ProductFormData & { imagenes: string[] }>({
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

  useEffect(() => { loadProducts() }, [])

  function authHeaders(): Record<string, string> {
    const token = sessionStorage.getItem('admin_token')
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
  }

  const loadProducts = async () => {
    const res = await fetch('/api/admin/products', { headers: authHeaders() })
    const data = await res.json()
    setProducts(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    const res = await fetch('/api/admin/products', {
      method: editing ? 'PUT' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify(editing ? { ...form, id: editing, imagen_principal: form.imagenes[0] || '' } : { ...form, imagen_principal: form.imagenes[0] || '' }),
    })
    if (res.ok) {
      setToast(editing ? t('guardado') : t('creado'))
      setTimeout(() => setToast(''), 3000)
      setEditing(null)
      setForm({
        slug: '', nombre_es: '', nombre_en: '', descripcion_es: '',
        descripcion_en: '', historia_es: '', historia_en: '',
        categoria_es: '', categoria_en: '', precio_mxn: 0, precio_usd: 0,
        stock: 0, peso_kg: 0, imagenes: [],
      })
      loadProducts()
    }
  }

  const handleEdit = (p: any) => {
    setEditing(p.id)
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
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar producto?')) return
    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: authHeaders(),
      body: JSON.stringify({ id }),
    })
    loadProducts()
  }

  if (loading) return <p className="text-center py-12">{t('cargando')}</p>

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm animate-fade-in">
          {toast}
        </div>
      )}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editing ? t('editar') : t('nuevo_producto')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Input label={t('precio_mxn')} type="number" value={form.precio_mxn} onChange={(e) => setForm({ ...form, precio_mxn: parseInt(e.target.value) || 0 })} />
          <Input label={t('precio_usd')} type="number" step="0.01" value={form.precio_usd} onChange={(e) => setForm({ ...form, precio_usd: parseFloat(e.target.value) || 0 })} />
          <Input label={t('stock')} type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
          <Input label={t('peso_kg')} type="number" step="0.01" value={form.peso_kg} onChange={(e) => setForm({ ...form, peso_kg: parseFloat(e.target.value) || 0 })} />
          <div className="md:col-span-2">
            <Input label={t('categoria_es')} value={form.categoria_es} onChange={(e) => setForm({ ...form, categoria_es: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Input label={t('categoria_en')} value={form.categoria_en} onChange={(e) => setForm({ ...form, categoria_en: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Input label={t('nombre_es')} value={form.nombre_es} onChange={(e) => setForm({ ...form, nombre_es: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Input label={t('nombre_en')} value={form.nombre_en} onChange={(e) => setForm({ ...form, nombre_en: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">{t('descripcion_es')}</label>
            <textarea className="w-full px-4 py-2.5 rounded-xl border border-arena bg-white resize-none h-24" value={form.descripcion_es} onChange={(e) => setForm({ ...form, descripcion_es: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">{t('descripcion_en')}</label>
            <textarea className="w-full px-4 py-2.5 rounded-xl border border-arena bg-white resize-none h-24" value={form.descripcion_en} onChange={(e) => setForm({ ...form, descripcion_en: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">{t('historia_es')}</label>
            <textarea className="w-full px-4 py-2.5 rounded-xl border border-arena bg-white resize-none h-24" value={form.historia_es} onChange={(e) => setForm({ ...form, historia_es: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">{t('historia_en')}</label>
            <textarea className="w-full px-4 py-2.5 rounded-xl border border-arena bg-white resize-none h-24" value={form.historia_en} onChange={(e) => setForm({ ...form, historia_en: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <ImageUploader
              images={form.imagenes}
              onChange={(imagenes) => setForm({ ...form, imagenes })}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button onClick={handleSave}>{t('guardar')}</Button>
          {editing && (
            <Button variant="ghost" onClick={() => { setEditing(null); setForm({ slug: '', nombre_es: '', nombre_en: '', descripcion_es: '', descripcion_en: '', historia_es: '', historia_en: '', categoria_es: '', categoria_en: '', precio_mxn: 0, precio_usd: 0, stock: 0, peso_kg: 0, imagenes: [] }) }}>
              {t('cancelar')}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {products.map((p: any) => (
          <div key={p.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-arena">
            <div>
              <p className="font-medium">{p.nombre_es}</p>
              <p className="text-sm text-negro-suave/40">
                {t('stock')}: {p.stock} | {t('precio_mxn')}: ${p.precio_mxn} | {t('precio_usd')}: ${p.precio_usd}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleEdit(p)}>{t('editar')}</Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)}>{t('eliminar')}</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
