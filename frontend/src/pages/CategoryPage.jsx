// src/pages/CategoryPage.jsx
import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import FilterBar from '../components/FilterBar.jsx'
import { getProducts } from '../api/products.js'
import { getCategories } from '../api/categories.js'

const SORT_OPTIONS = [
  { value: 'latest', label: 'Plus récents' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'popular', label: 'Plus populaires' },
]

export default function CategoryPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const subcategoryParam = searchParams.get('subcategory')

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mobileDrawer, setMobileDrawer] = useState(false)

  // Filtres
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    conditions: [],
    maxPrice: null,
    sort: 'latest',
  })

  // Initialise depuis l'URL
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: slug || '',
      subcategory: subcategoryParam || '',
    }))
  }, [slug, subcategoryParam])

  // Charge la catégorie
  useEffect(() => {
    getCategories().then((res) => {
      const cat = res.data.data.find((c) => c.slug === slug) || null
      setCategory(cat)
    }).catch(() => {})
  }, [slug])

  // Charge les produits selon les filtres
  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filters.category) params.category_id = filters.category
    if (filters.subcategory) params.subcategory = filters.subcategory
    if (filters.conditions?.length) params.condition = filters.conditions.join(',')
    if (filters.maxPrice) params.max_price = filters.maxPrice
    if (filters.sort) params.sort = filters.sort

    getProducts(params)
      .then((res) => setProducts(res.data.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [filters])

  const displayTitle = category?.name || 'Tous les articles'

  const clearFilter = (key) => {
    if (key === 'category') setFilters((p) => ({ ...p, category: '', subcategory: '' }))
    else setFilters((p) => ({ ...p, [key]: key === 'conditions' ? [] : null }))
  }

  const activeChips = useMemo(() => {
    const chips = []
    if (filters.category) {
      chips.push({ key: 'category', label: category?.name || filters.category })
    }
    if (filters.subcategory) {
      chips.push({ key: 'subcategory', label: filters.subcategory })
    }
    if (filters.conditions?.length) {
      const labels = { new: 'Neuf', like_new: 'Comme neuf', very_good: 'Très bon état', good: 'Bon état', satisfactory: 'État satisfaisant' }
      filters.conditions.forEach((c) => chips.push({ key: 'conditions', label: labels[c] || c }))
    }
    return chips
  }, [filters, category])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal">
            {displayTitle}
          </h1>
          <p className="text-sm text-gray-medium mt-1">
            {loading ? 'Chargement...' : `${products.length} résultat${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Tri */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
              className="appearance-none bg-cream-dark border border-transparent rounded-lg px-3 py-2 pr-8 text-sm text-charcoal outline-none focus:border-terracotta/30 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-light pointer-events-none" />
          </div>

          {/* Bouton filtres */}
          <button
            onClick={() => setMobileDrawer(true)}
            className="md:hidden flex items-center gap-1.5 bg-cream-dark border border-transparent rounded-lg px-3 py-2 text-sm text-charcoal hover:border-terracotta/30 transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filtres
          </button>
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="hidden md:flex items-center gap-1.5 bg-cream-dark border border-transparent rounded-lg px-3 py-2 text-sm text-charcoal hover:border-terracotta/30 transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filtres
          </button>
        </div>
      </div>

      {/* Chips filtres actifs */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeChips.map((chip, i) => (
            <span
              key={`${chip.key}-${i}`}
              className="inline-flex items-center gap-1 bg-black-solid text-white text-xs px-3 py-1 rounded-full"
            >
              {chip.label}
              <button onClick={() => clearFilter(chip.key)} className="hover:text-gray-light">
                <X size={12} />
              </button>
            </span>
          ))}
          {activeChips.length > 1 && (
            <button
              onClick={() => setFilters({ category: '', subcategory: '', conditions: [], maxPrice: null, sort: 'latest' })}
              className="text-xs text-gray-medium hover:text-terracotta underline transition-colors"
            >
              Tout effacer
            </button>
          )}
        </div>
      )}

      {/* Layout principal */}
      <div className="flex gap-6">
        {/* Sidebar filtres desktop */}
        {filtersOpen && (
          <div className="hidden md:block w-56 shrink-0">
            <div className="p-4">
              <FilterBar filters={filters} onChange={setFilters} />
            </div>
          </div>
        )}

        {/* Grille produits */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-cream-dark rounded-lg" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-cream-dark rounded w-3/4" />
                    <div className="h-3 bg-cream-dark rounded w-1/2" />
                    <div className="h-4 bg-cream-dark rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg font-medium text-charcoal mb-2">
                Aucun article trouvé
              </p>
              <p className="text-sm text-gray-medium">
                Essayez d&rsquo;autres filtres ou mots-clés
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Drawer mobile filtres */}
      {mobileDrawer && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileDrawer(false)} />

          {/* Panneau */}
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-cream shadow-xl flex flex-col">
            {/* Header fixe */}
            <div className="flex items-center justify-between p-4 border-b border-cream-dark/50 shrink-0">
              <h3 className="font-serif text-lg text-charcoal">Filtres</h3>
              <button
                onClick={() => setMobileDrawer(false)}
                className="p-2.5 text-gray-medium hover:text-charcoal transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <FilterBar filters={filters} onChange={setFilters} />
              </div>
              {/* Safe-area padding pour barres de navigation mobiles */}
              <div className="h-6" />
              <div className="pb-safe" />
            </div>

            {/* Footer sticky */}
            <div className="border-t border-cream-dark/50 p-4 shrink-0 bg-cream flex gap-3">
              <button
                onClick={() => {
                  setFilters({ category: slug || '', subcategory: subcategoryParam || '', conditions: [], maxPrice: null, sort: 'latest' })
                }}
                className="flex-1 text-sm text-gray-medium hover:text-charcoal transition-colors py-2"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setMobileDrawer(false)}
                className="flex-1 bg-black-solid hover:bg-charcoal text-white text-sm font-medium py-2 rounded-full transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
