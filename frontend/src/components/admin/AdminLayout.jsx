// src/components/admin/AdminLayout.jsx
import { useState } from 'react'
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Package, FolderTree,
  FileText, AlertTriangle, ChevronLeft, Menu, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Utilisateurs' },
  { to: '/admin/products', icon: Package, label: 'Annonces' },
  { to: '/admin/categories', icon: FolderTree, label: 'Catégories' },
  { to: '/admin/pages', icon: FileText, label: 'Pages' },
  { to: '/admin/reports', icon: AlertTriangle, label: 'Signalements' },
]

export default function AdminLayout() {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const closeSidebar = () => setSidebarOpen(false)

  const navLinks = (
    <nav className="flex-1 p-3 space-y-1">
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to
        return (
          <Link
            key={to}
            to={to}
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? 'bg-terracotta text-white font-medium'
                : 'text-gray-light hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:w-56 shrink-0 bg-charcoal text-white flex-col">
        <div className="p-4 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-terracotta">
              <span className="font-serif text-cream font-bold text-base">Y</span>
            </span>
            <span className="font-serif text-cream text-lg font-semibold">Admin</span>
          </Link>
        </div>
        {navLinks}
        <div className="p-3 border-t border-white/10">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-light hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <ChevronLeft size={14} />
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Header mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-charcoal text-white flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-terracotta">
            <span className="font-serif text-cream font-bold text-sm">Y</span>
          </span>
          <span className="font-serif text-cream font-semibold">Admin</span>
        </Link>
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-white">
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeSidebar} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-charcoal text-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="font-serif text-cream text-lg font-semibold">Admin</span>
              <button onClick={closeSidebar} className="p-1 text-gray-light hover:text-white">
                <X size={20} />
              </button>
            </div>
            {navLinks}
            <div className="p-3 border-t border-white/10">
              <Link to="/" onClick={closeSidebar} className="flex items-center gap-2 px-3 py-2 text-xs text-gray-light hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <ChevronLeft size={14} />
                Retour au site
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Contenu */}
      <main className="flex-1 bg-cream min-h-screen overflow-x-hidden pt-14 lg:pt-0">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
