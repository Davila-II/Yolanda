// src/components/FilterBar.jsx
import { useState, useEffect } from 'react'
import { getCategories } from '../api/categories.js'

const CONDITIONS = [
  { value: 'new', label: 'Neuf avec étiquette' },
  { value: 'like_new', label: 'Comme neuf' },
  { value: 'very_good', label: 'Très bon état' },
  { value: 'good', label: 'Bon état' },
  { value: 'satisfactory', label: 'État satisfaisant' },
]

export default function FilterBar({
  filters,
  onChange,
  className = '',
}) {
  const [categories, setCategories] = useState([])
  const selectedCategory = categories.find((c) => c.slug === filters.category)

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.data)).catch(() => {})
  }, [])

  const update = (key, value) => onChange({ ...filters, [key]: value })
  const toggleCondition = (val) => {
    const current = filters.conditions || []
    const next = current.includes(val)
      ? current.filter((c) => c !== val)
      : [...current, val]
    update('conditions', next)
  }

  const formatPrice = (p) =>
    new Intl.NumberFormat('fr-FR').format(p) + ' FCFA'

  return (
    <aside className={`bg-cream ${className}`}>
      <div className="space-y-6">
        {/* CATÉGORIE */}
        <FilterSection title="Catégorie">
          <button
            onClick={() => update('category', '')}
            className={`block w-full text-left text-sm py-1.5 transition-colors ${
              !filters.category ? 'text-terracotta font-medium' : 'text-gray-medium hover:text-charcoal'
            }`}
          >
            Toutes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => update('category', cat.slug)}
              className={`block w-full text-left text-sm py-1.5 transition-colors ${
                filters.category === cat.slug
                  ? 'text-terracotta font-medium'
                  : 'text-gray-medium hover:text-charcoal'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </FilterSection>

        {/* SOUS-CATÉGORIE */}
        {selectedCategory && selectedCategory.subcategories?.length > 0 && (
          <FilterSection title="Sous-catégorie">
            <button
              onClick={() => update('subcategory', '')}
              className={`block w-full text-left text-sm py-1.5 transition-colors ${
                !filters.subcategory ? 'text-terracotta font-medium' : 'text-gray-medium hover:text-charcoal'
              }`}
            >
              Toutes
            </button>
            {selectedCategory.subcategories.flatMap((sub) =>
              (sub.children || []).map((child) => (
                <button
                  key={child}
                  onClick={() => update('subcategory', child)}
                  className={`block w-full text-left text-sm py-1.5 transition-colors ${
                    filters.subcategory === child
                      ? 'text-terracotta font-medium'
                      : 'text-gray-medium hover:text-charcoal'
                  }`}
                >
                  {child}
                </button>
              ))
            )}
          </FilterSection>
        )}

        {/* ÉTAT */}
        <FilterSection title="État">
          {CONDITIONS.map((cond) => {
            const active = (filters.conditions || []).includes(cond.value)
            return (
              <button
                key={cond.value}
                onClick={() => toggleCondition(cond.value)}
                className={`flex items-center gap-2 w-full text-left text-sm py-1.5 transition-colors ${
                  active ? 'text-terracotta font-medium' : 'text-gray-medium hover:text-charcoal'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    active
                      ? 'border-terracotta bg-terracotta'
                      : 'border-gray-light'
                  }`}
                >
                  {active && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                {cond.label}
              </button>
            )
          })}
        </FilterSection>

        {/* PRIX MAX */}
        <FilterSection title="Prix max">
          <div className="space-y-2">
            <input
              type="range"
              min="500"
              max="200000"
              step="500"
              value={filters.maxPrice || 200000}
              onChange={(e) => update('maxPrice', Number(e.target.value))}
              className="w-full accent-terracotta h-1.5"
            />
            <div className="flex justify-between text-xs text-gray-light">
              <span>500 FCFA</span>
              <span className="text-terracotta font-medium">
                {formatPrice(filters.maxPrice || 200000)}
              </span>
              <span>200 000 FCFA</span>
            </div>
          </div>
        </FilterSection>
      </div>
    </aside>
  )
}

function FilterSection({ title, children }) {
  return (
    <div>
      <h4 className="text-xs text-gray-light uppercase tracking-wider mb-2 font-medium">
        {title}
      </h4>
      {children}
    </div>
  )
}
