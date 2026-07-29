// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        {/* Code 404 */}
        <p className="font-serif text-8xl md:text-9xl text-terracotta/20 mb-4 select-none">
          404
        </p>

        {/* Message */}
        <h1 className="font-serif text-2xl md:text-3xl text-charcoal mb-3">
          Page introuvable
        </h1>
        <p className="text-sm text-gray-medium mb-8 leading-relaxed">
          La page que vous cherchez n'existe pas ou a été déplacée.
          Vérifiez l'URL ou retournez à l'accueil pour continuer votre shopping.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-black-solid hover:bg-charcoal text-white text-sm font-medium px-6 py-3 rounded-full transition-colors"
          >
            <Home size={16} />
            Retour à l'accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-medium hover:text-charcoal transition-colors"
          >
            <ArrowLeft size={16} />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  )
}
