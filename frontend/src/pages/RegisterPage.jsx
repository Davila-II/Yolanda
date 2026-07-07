// src/pages/RegisterPage.jsx
import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    password_confirmation: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirige si déjà connecté
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { name, email, password, password_confirmation } = form

    if (!name.trim() || !email.trim() || !password) {
      setError('Veuillez remplir les champs obligatoires.')
      return
    }

    if (password !== password_confirmation) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)
    try {
      const user = await register({
        name: name.trim(),
        email: email.trim(),
        whatsapp: form.phone.trim(),
        city: form.city.trim(),
        password,
        password_confirmation,
      })
      navigate(user?.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Une erreur est survenue lors de l'inscription."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-cream-dark border border-transparent focus:border-terracotta/30 rounded-xl px-4 py-3 text-sm text-charcoal placeholder:text-gray-light outline-none transition-colors'

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-charcoal mb-2">
            Créer un compte
          </h1>
          <p className="text-sm text-gray-medium">
            Rejoignez la communauté Yolanda
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
            <label className="block text-xs text-gray-medium uppercase tracking-wider mb-1.5">
              Nom complet <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={updateField('name')}
              placeholder="Marie Kamga"
              autoComplete="name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-medium uppercase tracking-wider mb-1.5">
              Email <span className="text-error">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="votre@email.com"
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-medium uppercase tracking-wider mb-1.5">
              Téléphone / WhatsApp
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={updateField('phone')}
              placeholder="+237 6XX XXX XXX"
              autoComplete="tel"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-medium uppercase tracking-wider mb-1.5">
              Ville
            </label>
            <input
              type="text"
              value={form.city}
              onChange={updateField('city')}
              placeholder="Douala, Yaoundé..."
              autoComplete="address-level2"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-medium uppercase tracking-wider mb-1.5">
              Mot de passe <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={updateField('password')}
                placeholder="6 caractères minimum"
                autoComplete="new-password"
                className={`${inputClass} pr-10`}
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

          <div>
            <label className="block text-xs text-gray-medium uppercase tracking-wider mb-1.5">
              Confirmation du mot de passe <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.password_confirmation}
                onChange={updateField('password_confirmation')}
                placeholder="Répétez le mot de passe"
                autoComplete="new-password"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light hover:text-gray-medium transition-colors"
                aria-label={showConfirm ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black-solid hover:bg-charcoal text-white text-sm font-medium px-6 py-3 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        {/* Lien login */}
        <p className="text-center text-sm text-gray-medium mt-6">
          Déjà un compte ?{' '}
          <Link
            to="/login"
            className="text-terracotta hover:text-terracotta-hover font-medium transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
