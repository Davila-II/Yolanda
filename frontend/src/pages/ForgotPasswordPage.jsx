// src/pages/ForgotPasswordPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email.')
      return
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Veuillez saisir une adresse email valide.')
      return
    }

    setLoading(true)

    try {
      // TODO: appeler l'API backend sendPasswordResetEmail(email)
      // Pour l'instant, on simule l'envoi
      await new Promise((r) => setTimeout(r, 1500))
      setSent(true)
    } catch (err) {
      setError(err?.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-terracotta/10 rounded-2xl mb-4">
            <Mail size={24} className="text-terracotta" />
          </div>
          <h1 className="font-serif text-3xl text-charcoal mb-2">
            Mot de passe oublié ?
          </h1>
          <p className="text-sm text-gray-medium">
            {sent
              ? 'Consultez votre boîte de réception'
              : 'Saisissez votre email pour recevoir un lien de réinitialisation'}
          </p>
        </div>

        {sent ? (
          /* ═══ SUCCÈS ═══ */
          <div className="text-center">
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
              <p className="text-sm text-green-700 font-medium">
                Email envoyé !
              </p>
              <p className="text-xs text-green-600 mt-1">
                Si un compte existe avec l'adresse <strong>{email}</strong>,
                vous recevrez un lien de réinitialisation d'ici quelques minutes.
              </p>
            </div>
            <p className="text-xs text-gray-light mb-4">
              Vous n'avez rien reçu ? Vérifiez vos spams ou{' '}
              <button
                onClick={() => { setSent(false); setError('') }}
                className="text-terracotta hover:text-terracotta-hover font-medium transition-colors"
              >
                réessayez
              </button>
              .
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-medium hover:text-charcoal transition-colors"
            >
              <ArrowLeft size={16} />
              Retour à la connexion
            </Link>
          </div>
        ) : (
          /* ═══ FORMULAIRE ═══ */
          <>
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-error text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs text-gray-medium uppercase tracking-wider mb-1.5"
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  autoComplete="email"
                  autoFocus
                  className="w-full bg-cream-dark border border-transparent focus:border-terracotta/30 rounded-xl px-4 py-3 text-sm text-charcoal placeholder:text-gray-light outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black-solid hover:bg-charcoal text-white text-sm font-medium px-6 py-3 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-gray-medium hover:text-charcoal transition-colors"
              >
                <ArrowLeft size={16} />
                Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
