// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Star } from 'lucide-react'
import ImageGallery from '../components/ImageGallery.jsx'
import WhatsAppButton from '../components/WhatsAppButton.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { getProduct, getSimilarProducts } from '../api/products.js'

const CONDITION_LABELS = {
  new: 'Neuf avec étiquette',
  like_new: 'Comme neuf',
  very_good: 'Très bon état',
  good: 'Bon état',
  satisfactory: 'État satisfaisant',
}

function formatPrice(p) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(p) + ' FCFA'
}

function discountPercent(original, current) {
  if (!original || original <= current) return null
  return Math.round(((original - current) / original) * 100)
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([getProduct(id), getSimilarProducts(id)])
      .then(([prodRes, simRes]) => {
        setProduct(prodRes.data.data)
        setSimilar(simRes.data.data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse grid md:grid-cols-2 gap-8">
          <div className="aspect-[4/5] bg-cream-dark rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-cream-dark rounded w-3/4" />
            <div className="h-4 bg-cream-dark rounded w-1/2" />
            <div className="h-4 bg-cream-dark rounded w-1/3" />
            <div className="h-20 bg-cream-dark rounded" />
            <div className="h-12 bg-cream-dark rounded w-48" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-charcoal mb-2">Article introuvable</p>
        <Link to="/" className="text-sm text-terracotta hover:text-terracotta-hover">
          Retour à l&rsquo;accueil
        </Link>
      </div>
    )
  }

  const discount = discountPercent(product.original_price, product.price)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-light mb-6">
        <Link to="/" className="hover:text-terracotta transition-colors">Accueil</Link>
        <span className="mx-2">/</span>
        {product.category && (
          <>
            <Link
              to={`/category/${product.category.slug}`}
              className="hover:text-terracotta transition-colors"
            >
              {product.category.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-medium">{product.title}</span>
      </nav>

      {/* Grille principale */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Galerie */}
        <ImageGallery images={product.images} />

        {/* Infos */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">
            {product.title}
          </h1>

          <p className="text-sm text-gray-light mb-4">
            {product.brand}{product.size ? ` · Taille ${product.size}` : ''}
          </p>

          {/* État */}
          <span className="inline-block text-xs bg-cream-dark text-charcoal px-3 py-1 rounded-full mb-4">
            {CONDITION_LABELS[product.condition] || product.condition}
          </span>

          {/* Prix */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-semibold text-charcoal">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <>
                <span className="text-lg text-gray-light line-through">
                  {formatPrice(product.original_price)}
                </span>
                {discount && (
                  <span className="text-sm font-semibold text-terracotta bg-terracotta-light px-2 py-0.5 rounded-full">
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-8">
              <h3 className="text-xs text-gray-light uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-sm text-charcoal leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Vendeur */}
          {product.seller && (
            <div className="border-t border-cream-dark pt-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-black-solid flex items-center justify-center text-cream text-sm font-medium">
                  {product.seller.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    {product.seller.name}
                  </p>
                  {product.seller.rating && (
                    <p className="text-xs text-gray-medium flex items-center gap-1">
                      <Star size={12} fill="#D98C4A" stroke="#D98C4A" />
                      {product.seller.rating} · {product.seller.review_count || 0} avis
                    </p>
                  )}
                </div>
              </div>
              {product.seller.city && (
                <p className="text-xs text-gray-light flex items-center gap-1">
                  <MapPin size={12} />
                  {product.seller.city}
                </p>
              )}
            </div>
          )}

          {/* Bouton WhatsApp */}
          <WhatsAppButton
            phone={product.seller?.whatsapp || '+237600000000'}
            productTitle={product.title}
            className="w-full mb-3"
          />

          <p className="text-xs text-gray-light text-center">
            Contact direct via WhatsApp. Zéro commission.
          </p>
        </div>
      </div>

      {/* Produits similaires */}
      {similar.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-serif text-xl md:text-2xl text-charcoal">
              Produits similaires
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} showFavorite={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
