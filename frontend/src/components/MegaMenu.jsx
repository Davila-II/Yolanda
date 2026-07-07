// src/components/MegaMenu.jsx
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { getCategories } from '../api/categories.js'

export default function MegaMenu() {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const menuRef = useRef(null)
  const hoverTimeout = useRef(null)

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Ferme le mega-menu au clic extérieur
  useEffect(() => {
    if (!activeCategory) return
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveCategory(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [activeCategory])

  const handleMouseEnter = (slug) => {
    clearTimeout(hoverTimeout.current)
    setActiveCategory(slug)
  }

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setActiveCategory(null), 200)
  }

  const activeCategoryData = categories.find((c) => c.slug === activeCategory)

  if (loading) return null

  return (
    <div ref={menuRef} className="border-t border-cream-dark/50 bg-cream">
      {/* Nav horizontale */}
      <nav className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                onClick={() =>
                  setActiveCategory(activeCategory === cat.slug ? null : cat.slug)
                }
                onMouseEnter={() => handleMouseEnter(cat.slug)}
                onMouseLeave={handleMouseLeave}
                className={`flex items-center gap-1.5 px-3 py-3 text-sm whitespace-nowrap transition-colors border-b-2 ${
                  activeCategory === cat.slug
                    ? 'border-terracotta text-terracotta font-medium'
                    : 'border-transparent text-gray-medium hover:text-charcoal'
                }`}
              >
                {cat.name}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    activeCategory === cat.slug ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mega-menu dropdown */}
      {activeCategory && activeCategoryData && (
        <div
          className="absolute left-0 right-0 bg-cream border-t border-cream-dark/50 shadow-sm z-40"
          onMouseEnter={() => clearTimeout(hoverTimeout.current)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Lien "Tout voir" */}
              <div>
                <Link
                  to={`/category/${activeCategoryData.slug}`}
                  onClick={() => setActiveCategory(null)}
                  className="text-terracotta hover:text-terracotta-hover font-medium text-sm transition-colors"
                >
                  Tout voir dans {activeCategoryData.name} →
                </Link>
              </div>

              {/* Colonnes de sous-catégories */}
              {activeCategoryData.subcategories.map((sub) => (
                <div key={sub.name}>
                  <h4 className="text-xs text-gray-light font-medium uppercase tracking-wider mb-3">
                    {sub.name}
                  </h4>
                  <ul className="space-y-2">
                    {sub.children.map((child) => (
                      <li key={child}>
                        <Link
                          to={`/category/${activeCategoryData.slug}?subcategory=${encodeURIComponent(child)}`}
                          onClick={() => setActiveCategory(null)}
                          className="text-sm text-charcoal hover:text-terracotta transition-colors"
                        >
                          {child}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
