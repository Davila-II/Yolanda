// src/components/Header.jsx
import { Link } from 'react-router-dom'
import { Heart, User } from 'lucide-react'
import SearchBar from './SearchBar.jsx'
import MegaMenu from './MegaMenu.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header() {
  const { isAuthenticated, user } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-cream-dark/50">
      {/* Barre principale */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black-solid">
              <span className="font-serif text-cream font-bold text-base">Y</span>
            </span>
            <span className="font-serif text-charcoal text-xl font-semibold hidden sm:block">
              Yolanda
            </span>
          </Link>

          {/* Search bar — cachée sur mobile */}
          <SearchBar className="hidden md:block" />

          {/* Actions droite */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <Link
              to="/page/comment-ca-marche"
              className="hidden lg:block text-sm text-gray-medium hover:text-charcoal transition-colors whitespace-nowrap"
            >
              Comment ça marche&nbsp;?
            </Link>

            <Link
              to="/publish"
              className="flex items-center gap-1 bg-terracotta hover:bg-terracotta-hover text-white text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap"
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">Vendre</span>
            </Link>

            <Link
              to="/favorites"
              className="p-2 text-gray-medium hover:text-terracotta transition-colors"
              aria-label="Favoris"
            >
              <Heart size={20} />
            </Link>

            {/* Profil — connecté vs non connecté */}
            <Link
              to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/profile') : '/login'}
              className="p-2 text-gray-medium hover:text-terracotta transition-colors"
              aria-label={isAuthenticated ? (user?.role === 'admin' ? 'Administration' : 'Profil') : 'Connexion'}
            >
              {isAuthenticated ? (
                user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'Profil'}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black-solid text-cream text-xs font-medium font-sans">
                    {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </span>
                )
              ) : (
                <User size={20} />
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Barre de navigation catégories */}
      <MegaMenu />
    </header>
  )
}
