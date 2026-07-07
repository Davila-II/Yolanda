// src/pages/admin/ProductsPage.jsx
import { useState, useEffect } from 'react'
import DataTable from '../../components/admin/DataTable.jsx'
import { getProducts } from '../../api/products.js'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ per_page: 50 }).then((res) => {
      setProducts((res.data.data || []).map((p) => ({ ...p, status: 'published' })))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const updateStatus = (id, status) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    )
  }

  const formatPrice = (p) =>
    new Intl.NumberFormat('fr-FR').format(p) + ' FCFA'

  const columns = [
    { header: 'Titre', accessor: 'title' },
    { header: 'Vendeur', accessor: 'seller', render: (row) => row.seller?.name || '—' },
    { header: 'Prix', accessor: 'price', render: (row) => formatPrice(row.price) },
    {
      header: 'Statut',
      accessor: 'status',
      render: (row) => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          row.status === 'published' ? 'bg-green-50 text-success' :
          row.status === 'flagged' ? 'bg-orange-50 text-terracotta' :
          'bg-red-50 text-error'
        }`}>
          {row.status === 'published' ? 'Publié' : row.status === 'flagged' ? 'Signalé' : 'Retiré'}
        </span>
      ),
    },
  ]

  if (loading) return <div className="animate-pulse h-64 bg-cream-dark rounded-lg" />

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Annonces</h1>
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Rechercher une annonce..."
        renderActions={(row) => (
          <div className="flex items-center justify-end gap-2">
            {row.status !== 'published' && (
              <button onClick={() => updateStatus(row.id, 'published')} className="text-xs text-success hover:underline">Valider</button>
            )}
            {row.status !== 'flagged' && (
              <button onClick={() => updateStatus(row.id, 'flagged')} className="text-xs text-terracotta hover:underline">Signaler</button>
            )}
            <button onClick={() => updateStatus(row.id, 'removed')} className="text-xs text-error hover:underline">Retirer</button>
          </div>
        )}
      />
    </div>
  )
}
