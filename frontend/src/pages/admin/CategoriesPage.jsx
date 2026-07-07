// src/pages/admin/CategoriesPage.jsx
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { getCategories } from '../../api/categories.js'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(null) // { id, name, slug, subcategories }
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '' })

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.data)).catch(() => {})
  }, [])

  const resetForm = () => { setForm({ name: '', slug: '' }); setShowForm(false); setEditing(null) }

  const handleSave = () => {
    if (!form.name.trim()) return
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'et')
    if (editing) {
      setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...c, name: form.name, slug } : c))
    } else {
      setCategories((prev) => [...prev, { id: Date.now(), name: form.name, slug, subcategories: [] }])
    }
    resetForm()
  }

  const handleEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug })
    setEditing(cat)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Catégories</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-1.5 bg-terracotta hover:bg-terracotta-hover text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-cream border border-cream-dark/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-charcoal">
              {editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h3>
            <button onClick={resetForm} className="text-gray-light hover:text-charcoal"><X size={16} /></button>
          </div>
          <div className="flex gap-3">
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nom" className="flex-1 bg-cream-dark rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-terracotta/30" />
            <input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="slug" className="w-40 bg-cream-dark rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-terracotta/30" />
            <button onClick={handleSave}
              className="bg-black-solid hover:bg-charcoal text-white text-sm px-4 py-2 rounded-full transition-colors">
              {editing ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-cream border border-cream-dark/50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">{cat.name}</p>
              <p className="text-xs text-gray-light">/{cat.slug} — {cat.subcategories?.length || 0} sous-catégories</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(cat)} className="p-1.5 text-gray-medium hover:text-terracotta transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-medium hover:text-error transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
