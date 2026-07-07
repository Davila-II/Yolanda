// src/components/BottomNav.jsx
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, PlusCircle, Heart, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/search', icon: Search, label: 'Recherche' },
  { to: '/publish', icon: PlusCircle, label: 'Vendre', highlight: true },
  { to: '/favorites', icon: Heart, label: 'Favoris' },
]

export default function BottomNav() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-cream border-t border-cream-dark/50 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label, highlight }) => {
          const active = isActive(to)
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-1 py-1 transition-colors ${
                highlight
                  ? 'text-terracotta font-medium'
                  : active
                    ? 'text-terracotta'
                    : 'text-gray-light hover:text-gray-medium'
              }`}
            >
              <Icon
                size={highlight ? 26 : 22}
                strokeWidth={active || highlight ? 2.5 : 2}
              />
              <span className="text-[10px] leading-tight whitespace-nowrap">
                {label}
              </span>
            </Link>
          )
        })}

        {/* Profil (dernier item, conditionnel) */}
        <Link
          to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/profile') : '/login'}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-1 py-1 transition-colors ${
            isActive('/profile') || isActive('/admin') ? 'text-terracotta' : 'text-gray-light hover:text-gray-medium'
          }`}
        >
          <User size={22} strokeWidth={isActive('/profile') ? 2.5 : 2} />
          <span className="text-[10px] leading-tight whitespace-nowrap">
            Profil
          </span>
        </Link>
      </div>
    </nav>
  )
}
