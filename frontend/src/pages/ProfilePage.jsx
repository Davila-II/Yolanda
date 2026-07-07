// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Package, Heart, Settings, Pencil, Plus, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { getProducts } from '../api/products.js'

const TABS = [
  { key: 'articles', icon: Package, label: 'Mes articles' },
  { key: 'favorites', icon: Heart, label: 'Favoris' },
  { key: 'settings', icon: Settings, label: 'Paramètres' },
]

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('articles')
  const [products, setProducts] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    whatsapp: user?.whatsapp || '',
    city: user?.city || '',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getProducts({ per_page: 50 }).then((res) => {
      const all = res.data.data || []
      setProducts(all)
      setFavorites(all.filter((p) => p.is_favorite))
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const updateField = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSave = (e) => {
    e.preventDefault()
    // TEMPORARY MOCK: enregistre localement (à remplacer par PATCH /api/v1/user)
    const updated = { ...user, ...form }
    try { localStorage.setItem('user', JSON.stringify(updated)) } catch { /* ignore */ }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-charcoal mb-2">Connectez-vous pour accéder à votre profil.</p>
        <Link to="/login" className="text-sm text-terracotta hover:text-terracotta-hover font-medium">Se connecter</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ── En-tête profil ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8 pb-8 border-b border-cream-dark/50">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black-solid flex items-center justify-center text-cream text-xl md:text-2xl font-serif shrink-0">
            {user.name?.charAt(0)?.toUpperCase() || '?'}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-serif text-xl md:text-2xl text-charcoal">{user.name}</h1>
              <button className="text-xs text-gray-medium hover:text-terracotta transition-colors" title="Modifier le profil">
                <Pencil size={14} />
              </button>
            </div>
            <p className="text-sm text-gray-light">@{user.username || 'utilisateur'}</p>
            {user.city && (
              <p className="text-xs text-gray-medium flex items-center gap-1 mt-1">
                <MapPin size={12} /> {user.city}
              </p>
            )}
            {user.bio && (
              <p className="text-sm text-charcoal mt-2 line-clamp-2 max-w-md">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 sm:gap-10">
          <StatBox value={products.length} label="Articles" />
          <StatBox value="4.8" label="Note" extra={<><Star size={12} fill="#D98C4A" stroke="#D98C4A" className="inline" /> 24 avis</>} />
          <StatBox value="56" label="Ventes" />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-cream-dark/50 mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === key
                ? 'border-terracotta text-terracotta font-medium'
                : 'border-transparent text-gray-medium hover:text-charcoal'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Onglet Articles ── */}
      {activeTab === 'articles' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-medium">{products.length} article{products.length !== 1 ? 's' : ''}</p>
            <Link to="/publish" className="inline-flex items-center gap-1.5 bg-terracotta hover:bg-terracotta-hover text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
              <Plus size={16} /> Ajouter un article
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="animate-pulse"><div className="aspect-[4/5] bg-cream-dark rounded-lg" /></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} showFavorite={false} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-medium text-center py-12">Aucun article publié.</p>
          )}
        </div>
      )}

      {/* ── Onglet Favoris ── */}
      {activeTab === 'favorites' && (
        <div>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {favorites.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-3">
                <Heart size={24} className="text-gray-light" />
              </div>
              <p className="text-charcoal font-medium mb-1">Vos articles favoris apparaîtront ici.</p>
              <Link to="/search" className="text-sm text-terracotta hover:text-terracotta-hover font-medium">
                Explorer les articles →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Onglet Paramètres ── */}
      {activeTab === 'settings' && (
        <div className="max-w-md">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="font-serif text-lg text-charcoal mb-4">Informations du compte</h3>

            <InputField label="Nom complet" value={form.name} onChange={updateField('name')} placeholder="Marie Kamga" />
            <InputField label="Nom d'utilisateur" value={form.username} onChange={updateField('username')} placeholder="mariekamga" />
            <InputField label="Numéro WhatsApp" value={form.whatsapp} onChange={updateField('whatsapp')} placeholder="+237 6XX XXX XXX" type="tel" />
            <InputField label="Ville" value={form.city} onChange={updateField('city')} placeholder="Douala" />

            <button type="submit" className="w-full bg-black-solid hover:bg-charcoal text-white text-sm font-medium py-3 rounded-full transition-colors">
              {saved ? '✓ Modifications enregistrées' : 'Enregistrer les modifications'}
            </button>
          </form>

          {/* Déconnexion */}
          <div className="mt-10 pt-6 border-t border-cream-dark/50">
            <h4 className="text-xs text-gray-light uppercase tracking-wider mb-3">Compte</h4>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-error hover:text-red-700 transition-colors"
            >
              <LogOut size={16} />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function StatBox({ value, label, extra }) {
  return (
    <div className="text-center">
      <p className="text-lg font-semibold text-charcoal">{value}</p>
      <p className="text-xs text-gray-medium">{label}</p>
      {extra && <p className="text-xs text-gray-light mt-0.5">{extra}</p>}
    </div>
  )
}

function InputField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs text-gray-light uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-cream-dark rounded-xl px-4 py-3 text-sm text-charcoal placeholder:text-gray-light outline-none focus:ring-1 focus:ring-terracotta/30 transition-shadow" />
    </div>
  )
}
