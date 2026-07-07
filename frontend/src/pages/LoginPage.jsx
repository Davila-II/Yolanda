// src/pages/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirige si déjà connecté
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Veuillez remplir tous les champs.')
      return
    }

    setLoading(true)
    try {
      const user = await login({ email: email.trim(), password })
      navigate(user?.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Email ou mot de passe incorrect.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-charcoal mb-2">Connexion</h1>
          <p className="text-sm text-gray-medium">
            Connectez-vous pour accéder à votre compte
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-error text-center">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs text-gray-medium uppercase tracking-wider mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              autoComplete="email"
              className="w-full bg-cream-dark border border-transparent focus:border-terracotta/30 rounded-xl px-4 py-3 text-sm text-charcoal placeholder:text-gray-light outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs text-gray-medium uppercase tracking-wider mb-1.5"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-cream-dark border border-transparent focus:border-terracotta/30 rounded-xl pl-4 pr-10 py-3 text-sm text-charcoal placeholder:text-gray-light outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light hover:text-gray-medium transition-colors"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black-solid hover:bg-charcoal text-white text-sm font-medium px-6 py-3 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Lien register */}
        <p className="text-center text-sm text-gray-medium mt-6">
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="text-terracotta hover:text-terracotta-hover font-medium transition-colors"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
