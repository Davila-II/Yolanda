// src/pages/SearchPage.jsx
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import FilterBar from '../components/FilterBar.jsx'
import { getProducts } from '../api/products.js'

const SORT_OPTIONS = [
  { value: 'latest', label: 'Plus récents' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'popular', label: 'Plus populaires' },
]

const CONDITION_LABELS = {
  new: 'Neuf',
  like_new: 'Comme neuf',
  very_good: 'Très bon état',
  good: 'Bon état',
  satisfactory: 'État satisfaisant',
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mobileDrawer, setMobileDrawer] = useState(false)

  // Champ de recherche textuelle
  const [query, setQuery] = useState(searchParams.get('q') || '')

  // Filtres
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    conditions: searchParams.get('condition')?.split(',').filter(Boolean) || [],
    sizes: searchParams.get('size')?.split(',').filter(Boolean) || [],
    maxPrice: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : null,
    minPrice: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : null,
    sort: searchParams.get('sort') || 'latest',
  })

  // Synchronise l'URL avec les filtres
  useEffect(() => {
    const params = {}
    if (query.trim()) params.q = query.trim()
    if (filters.category) params.category = filters.category
    if (filters.subcategory) params.subcategory = filters.subcategory
    if (filters.conditions?.length) params.condition = filters.conditions.join(',')
    if (filters.sizes?.length) params.size = filters.sizes.join(',')
    if (filters.maxPrice) params.max_price = String(filters.maxPrice)
    if (filters.minPrice) params.min_price = String(filters.minPrice)
    if (filters.sort && filters.sort !== 'latest') params.sort = filters.sort
    setSearchParams(params, { replace: true })
  }, [query, filters, setSearchParams])

  // Charge les produits
  useEffect(() => {
    setLoading(true)
    const params = {}
    if (query.trim()) params.q = query.trim()
    if (filters.category) params.category_id = filters.category
    if (filters.subcategory) params.subcategory = filters.subcategory
    if (filters.conditions?.length) params.condition = filters.conditions.join(',')
    if (filters.sizes?.length) params.size = filters.sizes.join(',')
    if (filters.maxPrice) params.max_price = filters.maxPrice
    if (filters.minPrice) params.min_price = filters.minPrice
    if (filters.sort) params.sort = filters.sort

    getProducts(params)
      .then((res) => setProducts(res.data.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [query, filters])

  const handleQuerySubmit = useCallback((e) => {
    e.preventDefault()
    // Le useEffect se déclenche déjà via le state query
    // Forcer le re-render en modifiant légèrement les params
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (query.trim()) next.set('q', query.trim())
      else next.delete('q')
      return next
    })
  }, [query, setSearchParams])

  const clearFilter = (key) => {
    if (key === 'category') setFilters((p) => ({ ...p, category: '', subcategory: '' }))
    else if (key === 'conditions') setFilters((p) => ({ ...p, conditions: [] }))
    else if (key === 'sizes') setFilters((p) => ({ ...p, sizes: [] }))
    else setFilters((p) => ({ ...p, [key]: key === 'maxPrice' || key === 'minPrice' ? null : '' }))
  }

  const clearAll = () => {
    setQuery('')
    setFilters({
      category: '',
      subcategory: '',
      conditions: [],
      sizes: [],
      maxPrice: null,
      minPrice: null,
      sort: 'latest',
    })
  }

  const activeChips = useMemo(() => {
    const chips = []
    if (filters.category) chips.push({ key: 'category', type: 'category', label: filters.category })
    if (filters.subcategory) chips.push({ key: 'subcategory', type: 'subcategory', label: filters.subcategory })
    if (filters.conditions?.length) {
      filters.conditions.forEach((c, i) =>
        chips.push({ key: `cond-${i}`, type: 'conditions', label: CONDITION_LABELS[c] || c })
      )
    }
    if (filters.sizes?.length) {
      filters.sizes.forEach((s, i) =>
        chips.push({ key: `size-${i}`, type: 'sizes', label: `Taille ${s}` })
      )
    }
    if (filters.maxPrice) chips.push({ key: 'maxPrice', type: 'maxPrice', label: `≤ ${filters.maxPrice.toLocaleString('fr-FR')} FCFA` })
    if (filters.minPrice) chips.push({ key: 'minPrice', type: 'minPrice', label: `≥ ${filters.minPrice.toLocaleString('fr-FR')} FCFA` })
    return chips
  }, [filters])

  const displayTitle = query ? `Recherche : « ${query} »` : 'Tous les articles'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ═══ BARRE DE RECHERCHE ═══ */}
      <form onSubmit={handleQuerySubmit} className="mb-6">
        <div className="relative max-w-2xl mx-auto">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-light" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un article, une marque, une catégorie..."
            className="w-full bg-cream-dark border-2 border-transparent focus:border-terracotta/30 rounded-2xl pl-12 pr-4 py-3.5 text-base text-charcoal placeholder:text-gray-light outline-none transition-colors"
          />
        </div>
      </form>

      {/* ═══ EN-TÊTE ═══ */}
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

      {/* ═══ CHIPS FILTRES ═══ */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 bg-black-solid text-white text-xs px-3 py-1 rounded-full"
            >
              {chip.label}
              <button onClick={() => clearFilter(chip.type)} className="hover:text-gray-light">
                <X size={12} />
              </button>
            </span>
          ))}
          {(activeChips.length > 1 || query) && (
            <button
              onClick={clearAll}
              className="text-xs text-gray-medium hover:text-terracotta underline transition-colors"
            >
              Tout effacer
            </button>
          )}
        </div>
      )}

      {/* ═══ LAYOUT PRINCIPAL ═══ */}
      <div className="flex gap-6">
        {/* Sidebar filtres desktop */}
        {filtersOpen && (
          <div className="hidden md:block w-56 shrink-0">
            <div className="bg-cream rounded-xl p-4 border border-cream-dark">
              <FilterBar filters={filters} onChange={setFilters} />
              {/* Filtre prix min supplémentaire */}
              <div className="mt-6">
                <h4 className="text-xs text-gray-light uppercase tracking-wider mb-2 font-medium">
                  Prix min
                </h4>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value ? Number(e.target.value) : null }))}
                  placeholder="0 FCFA"
                  className="w-full bg-cream-dark border border-transparent focus:border-terracotta/30 rounded-lg px-3 py-2 text-sm text-charcoal placeholder:text-gray-light outline-none transition-colors"
                />
              </div>
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
              <Search size={48} className="mx-auto text-gray-light mb-4" />
              <p className="text-lg font-medium text-charcoal mb-2">
                Aucun résultat
              </p>
              <p className="text-sm text-gray-medium mb-6">
                Essayez de modifier vos filtres ou d'élargir votre recherche.
              </p>
              <button
                onClick={clearAll}
                className="text-sm text-terracotta hover:text-terracotta-hover font-medium transition-colors"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ DRAWER MOBILE ═══ */}
      {mobileDrawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileDrawer(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-cream shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-cream-dark">
              <h3 className="font-medium text-charcoal">Filtres</h3>
              <button
                onClick={() => setMobileDrawer(false)}
                className="p-1 hover:bg-cream-dark rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-medium" />
              </button>
            </div>
            <div className="p-4">
              <FilterBar filters={filters} onChange={setFilters} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
