// src/components/SearchBar.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export default function SearchBar({ className = '', onSearch }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    if (onSearch) {
      onSearch(trimmed)
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex-1 max-w-md mx-4 ${className}`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un article, une marque, une couleur..."
        className="w-full bg-cream-dark border border-transparent focus:border-terracotta/30 rounded-full pl-10 pr-4 py-2 text-sm text-charcoal placeholder:text-gray-light outline-none transition-colors"
      />
      <button
        type="submit"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-light hover:text-terracotta transition-colors"
        aria-label="Rechercher"
      >
        <Search size={16} />
      </button>
    </form>
  )
}
