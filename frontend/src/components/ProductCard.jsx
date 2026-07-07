// src/components/ProductCard.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { toggleFavorite } from '../api/favorites.js'

/** Formate un prix en FCFA avec séparateur de milliers */
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA'
}

/** Calcule le pourcentage de réduction */
function discountPercent(original, current) {
  if (!original || original <= current) return null
  return Math.round(((original - current) / original) * 100)
}

/** Bouton favori avec toggle */
function FavoriteButton({ productId, initial }) {
  const [isFav, setIsFav] = useState(initial)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const toggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setIsFav((prev) => !prev)
    toggleFavorite(productId).catch(() => setIsFav((prev) => !prev))
  }

  return (
    <button
      onClick={toggle}
      className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-gray-medium hover:text-terracotta transition-colors"
      aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        size={16}
        fill={isFav ? '#D98C4A' : 'none'}
        stroke={isFav ? '#D98C4A' : 'currentColor'}
      />
    </button>
  )
}

export default function ProductCard({ product, showFavorite = true }) {
  const {
    id,
    title,
    brand,
    size,
    condition,
    price,
    original_price,
    images,
    is_favorite,
  } = product

  const discount = discountPercent(original_price, price)
  const hasImage = images && images.length > 0
  const isNew = condition === 'new'

  return (
    <Link
      to={`/product/${id}`}
      className="group block rounded-lg overflow-hidden bg-cream transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] bg-cream-dark overflow-hidden">
        {hasImage ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-light text-xs">Image indisponible</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {isNew && (
            <span className="inline-block bg-black-solid text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              Neuf
            </span>
          )}
        </div>

        {discount && (
          <span className="absolute top-2 right-2 inline-block bg-terracotta-light text-terracotta text-[10px] font-semibold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}

        {/* Favoris (optionnel) */}
        {showFavorite && <FavoriteButton productId={id} initial={is_favorite} />}
      </div>

      {/* Infos */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-charcoal line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-light mb-2">
          {brand}{size ? ` · ${size}` : ''}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-charcoal">
            {formatPrice(price)}
          </span>
          {original_price && original_price > price && (
            <span className="text-xs text-gray-light line-through">
              {formatPrice(original_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
