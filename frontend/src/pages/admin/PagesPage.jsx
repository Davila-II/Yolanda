// src/pages/admin/PagesPage.jsx
import { useState } from 'react'
import { Pencil, ExternalLink } from 'lucide-react'

const MOCK_PAGES = [
  { id: 1, title: 'Comment ça marche', slug: 'comment-ca-marche', updated_at: '2026-06-15' },
  { id: 2, title: 'Confidentialité', slug: 'confidentialite', updated_at: '2026-05-20' },
  { id: 3, title: 'Conditions générales d\'utilisation', slug: 'cgu', updated_at: '2026-05-20' },
  { id: 4, title: 'Cookies', slug: 'cookies', updated_at: '2026-04-10' },
]

export default function AdminPagesPage() {
  const [pages, setPages] = useState(MOCK_PAGES)
  const [editing, setEditing] = useState(null)
  const [content, setContent] = useState('')

  const handleEdit = (page) => {
    setEditing(page.id)
    setContent(`Contenu de la page "${page.title}"...\n\n(Éditeur simple — sera remplacé par un vrai éditeur riche)`)
  }

  const handleSave = () => {
    setEditing(null)
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Pages statiques</h1>

      {editing && (
        <div className="bg-cream border border-cream-dark/50 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-medium text-charcoal mb-2">
            Modification : {pages.find((p) => p.id === editing)?.title}
          </h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full bg-cream-dark rounded-lg p-3 text-sm text-charcoal outline-none focus:ring-1 focus:ring-terracotta/30 resize-none mb-3"
          />
          <div className="flex gap-2">
            <button onClick={handleSave}
              className="bg-black-solid hover:bg-charcoal text-white text-sm px-4 py-2 rounded-full transition-colors">
              Enregistrer
            </button>
            <button onClick={() => setEditing(null)}
              className="text-sm text-gray-medium hover:text-charcoal transition-colors px-4 py-2">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-2">
        {pages.map((page) => (
          <div key={page.id} className="bg-cream border border-cream-dark/50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">{page.title}</p>
              <p className="text-xs text-gray-light">/{page.slug} · Mis à jour le {page.updated_at}</p>
            </div>
            <div className="flex items-center gap-2">
              <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer"
                className="p-1.5 text-gray-medium hover:text-terracotta transition-colors">
                <ExternalLink size={16} />
              </a>
              <button onClick={() => handleEdit(page)}
                className="p-1.5 text-gray-medium hover:text-terracotta transition-colors">
                <Pencil size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
