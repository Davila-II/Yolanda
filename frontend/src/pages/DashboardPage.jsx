// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Archive, RotateCcw } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { getMyProducts, updateProductStatus, deleteProduct } from '../api/products.js'

const STATUS_LABELS = { published: 'Publié', sold: 'Vendu', archived: 'Archivé' }

export default function DashboardPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyProducts().then((res) => {
      setProducts(res.data.data || [])
    }).catch(() => setProducts([]))
    .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = (updated) =>
    setProducts((prev) => prev.map((x) => (x.id === updated.id ? { ...x, status: updated.status } : x)))

  const handleDelete = (id) =>
    setProducts((prev) => prev.filter((x) => x.id !== id))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal">Tableau de bord</h1>
          <p className="text-sm text-gray-medium mt-1">
            {products.length} article{products.length !== 1 ? 's' : ''} publié{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/publish"
          className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-hover text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
        >
          <Plus size={18} />
          Ajouter un article
        </Link>
      </div>

      {/* Grille */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-cream-dark rounded-lg" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-cream-dark rounded w-3/4" />
                <div className="h-3 bg-cream-dark rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map((p) => (
            <DashboardProductCard
              key={p.id}
              product={p}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg font-medium text-charcoal mb-2">
            Vous n&rsquo;avez pas encore publié d&rsquo;article.
          </p>
          <Link to="/publish" className="text-sm text-terracotta hover:text-terracotta-hover font-medium">
            + Publier mon premier article
          </Link>
        </div>
      )}
    </div>
  )
}

function DashboardProductCard({ product, onStatusChange, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const isSold = product.status === 'sold'

  const handleEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(false)
    navigate(`/publish?edit=${product.id}`, { state: { product } })
  }

  const handleStatus = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const next = isSold ? 'published' : 'sold'
    setBusy(true)
    try {
      const res = await updateProductStatus(product.id, next)
      onStatusChange(res.data?.data || { ...product, status: next })
      setMenuOpen(false)
    } catch {
      // ignore
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Supprimer cet article définitivement ?')) return
    setBusy(true)
    try {
      await deleteProduct(product.id)
      onDelete(product.id)
      setMenuOpen(false)
    } catch {
      // ignore
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative group">
      <ProductCard product={product} showFavorite={false} />

      {/* Actions au survol */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-medium hover:text-charcoal transition-colors"
          title="Actions"
        >
          <Pencil size={14} />
        </button>
      </div>

      {/* Status badge */}
      <span className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full ${
        isSold ? 'bg-emerald-100 text-emerald-700' : 'bg-cream-dark text-charcoal'
      }`}>
        {STATUS_LABELS[product.status] || 'Publié'}
      </span>

      {/* Menu actions */}
      {menuOpen && (
        <div className="absolute top-10 right-2 bg-white shadow-lg rounded-lg py-1 z-10 min-w-[140px]" onMouseLeave={() => setMenuOpen(false)}>
          <button
            onClick={handleEdit}
            className="w-full text-left px-3 py-2 text-xs text-gray-medium hover:text-charcoal hover:bg-cream-dark flex items-center gap-2"
          >
            <Pencil size={12} /> Modifier
          </button>
          <button
            onClick={handleStatus}
            disabled={busy}
            className="w-full text-left px-3 py-2 text-xs text-gray-medium hover:text-charcoal hover:bg-cream-dark flex items-center gap-2 disabled:opacity-50"
          >
            {isSold ? <RotateCcw size={12} /> : <Archive size={12} />} {isSold ? 'Remettre en vente' : 'Marquer comme vendu'}
          </button>
          <button
            onClick={handleDelete}
            disabled={busy}
            className="w-full text-left px-3 py-2 text-xs text-error hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={12} /> Supprimer
          </button>
        </div>
      )}
    </div>
  )
}
