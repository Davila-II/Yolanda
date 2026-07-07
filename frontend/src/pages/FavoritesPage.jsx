// src/pages/FavoritesPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { getProducts } from '../api/products.js'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // En mock : on filtre les produits avec is_favorite=true
    getProducts({ per_page: 50 }).then((res) => {
      const favs = (res.data.data || []).filter((p) => p.is_favorite)
      setFavorites(favs)
    }).catch(() => setFavorites([]))
    .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">Mes favoris</h1>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
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
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
          {favorites.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-gray-light" />
          </div>
          <p className="text-lg font-medium text-charcoal mb-2">
            Vos articles favoris apparaîtront ici.
          </p>
          <p className="text-sm text-gray-medium mb-4">
            Ajoutez des articles à vos favoris pour les retrouver facilement.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-1 text-sm text-terracotta hover:text-terracotta-hover font-medium transition-colors"
          >
            Explorer les articles →
          </Link>
        </div>
      )}
    </div>
  )
}
