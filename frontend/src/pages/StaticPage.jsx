// src/pages/StaticPage.jsx
import { useParams, Link } from 'react-router-dom'
import { ArrowRight, Upload, MessageCircle, Handshake, Check, Search, Heart, Shield, Smartphone, ChevronDown, MapPin, Star } from 'lucide-react'
import { useState } from 'react'

export default function StaticPage() {
  const { slug } = useParams()

  switch (slug) {
    case 'comment-ca-marche':
      return <CommentCaMarchePage />
    default:
      return (
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-2xl text-charcoal mb-4">Page introuvable</h1>
          <Link to="/" className="text-sm text-terracotta hover:text-terracotta-hover">Retour à l&rsquo;accueil</Link>
        </div>
      )
  }
}

/* ═══════════════════════════════════════
   Comment ça marche
   ═══════════════════════════════════════ */
function CommentCaMarchePage() {
  return (
    <div>
      {/* Vendre */}
      <Section bg="bg-cream">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">Comment ça marche</h1>
          <p className="text-gray-medium max-w-xl mb-12">
            Découvrez comment vendre et acheter en toute simplicité sur Yolanda, la marketplace
            camerounaise de mode de seconde main.
          </p>

          <h2 className="font-serif text-xl md:text-2xl text-charcoal mb-8 flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-terracotta text-white shrink-0">
              <Upload size={20} />
            </span>
            Vendre sur Yolanda
          </h2>

          <p className="text-sm text-gray-medium mb-8 max-w-xl">
            Publiez vos vêtements gratuitement, soyez contacté directement sur WhatsApp
            et encaissez 100% du prix de vente — sans commission.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              { num: '01', title: 'Prenez de belles photos', desc: 'Photographiez vos articles sur un fond uni, sous une bonne lumière. Des photos claires attirent plus d\'acheteurs.' },
              { num: '02', title: 'Créez votre annonce', desc: 'Ajoutez un titre, une description, le prix et vos coordonnées WhatsApp. C\'est gratuit et prend 2 minutes.' },
              { num: '03', title: 'Soyez contacté', desc: 'Les acheteurs vous contactent directement via WhatsApp. Convenez d\'un lieu de rencontre et finalisez la vente.' },
            ].map((step, i) => (
              <div key={i} className="bg-cream-dark rounded-xl p-6">
                <span className="text-2xl font-serif text-terracotta font-semibold">{step.num}</span>
                <h3 className="text-sm font-semibold text-charcoal mt-3 mb-2">{step.title}</h3>
                <p className="text-xs text-gray-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <TipBox>
            <h3 className="text-sm font-semibold text-charcoal mb-3">Conseils pour bien vendre</h3>
            <ul className="space-y-2">
              {[
                'Prenez vos photos à la lumière naturelle, sur un fond uni',
                'Soyez honnête sur l\'état de l\'article (défauts, usure)',
                'Indiquez les mesures exactes (largeur, longueur)',
                'Fixez un prix juste : les articles entre 3 000 et 15 000 FCFA se vendent le plus vite',
                'Répondez rapidement aux messages WhatsApp',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-charcoal/70">
                  <Check size={14} className="text-terracotta shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </TipBox>

          <Link to="/publish" className="inline-flex items-center gap-2 bg-black-solid hover:bg-charcoal text-white text-sm font-medium px-6 py-3 rounded-full transition-colors mt-6">
            Publier mon premier article <ArrowRight size={16} />
          </Link>
        </div>
      </Section>

      {/* Acheter */}
      <Section bg="bg-cream-dark">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <h2 className="font-serif text-xl md:text-2xl text-charcoal mb-8 flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-charcoal text-cream shrink-0">
              <Search size={20} />
            </span>
            Acheter sur Yolanda
          </h2>

          <p className="text-sm text-gray-medium mb-8 max-w-xl">
            Trouvez des pièces uniques à petits prix, contactez directement les vendeurs
            et faites de bonnes affaires.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Search, title: 'Cherchez & filtrez', desc: 'Parcourez les catégories ou utilisez la recherche pour trouver exactement ce que vous cherchez.' },
              { icon: Heart, title: 'Ajoutez en favoris', desc: 'Gardez vos articles préférés dans vos favoris pour les retrouver facilement.' },
              { icon: MessageCircle, title: 'Contactez le vendeur', desc: 'Discutez directement avec le vendeur via WhatsApp pour poser vos questions.' },
              { icon: Handshake, title: 'Finalisez la transaction', desc: 'Convenez d\'un lieu de rencontre sécurisé et réglez en espèces ou Mobile Money.' },
            ].map((item, i) => (
              <div key={i} className="bg-cream rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-terracotta-light flex items-center justify-center text-terracotta mb-4">
                  <item.icon size={20} />
                </div>
                <h3 className="text-sm font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-xs text-gray-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <Link to="/search" className="inline-flex items-center gap-2 bg-black-solid hover:bg-charcoal text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">
            Explorer les articles <ArrowRight size={16} />
          </Link>
        </div>
      </Section>

      {/* Confiance & Sécurité */}
      <Section bg="bg-cream">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <h2 className="font-serif text-xl md:text-2xl text-charcoal mb-8 flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-terracotta text-white shrink-0">
              <Shield size={20} />
            </span>
            Confiance & Sécurité
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Star, title: 'Système d\'évaluations', desc: 'Après chaque transaction, acheteurs et vendeurs peuvent s\'évaluer. Consultez les avis avant d\'acheter.' },
              { icon: MapPin, title: 'Conseil n°1 : rencontrez en public', desc: 'Privilégiez les lieux publics et fréquentés pour vos échanges. Les centres commerciaux sont idéaux.' },
              { icon: MessageCircle, title: 'Communication directe', desc: 'Toutes les discussions passent par WhatsApp. Gardez une trace de vos échanges.' },
              { icon: Smartphone, title: 'Mobile Money recommandé', desc: 'MTN Mobile Money et Orange Money sont des moyens de paiement pratiques et sécurisés au Cameroun.' },
            ].map((item, i) => (
              <div key={i} className="bg-cream-dark rounded-xl p-6 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-terracotta-light flex items-center justify-center text-terracotta shrink-0">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-charcoal mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section bg="bg-cream-dark">
        <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
          <h2 className="font-serif text-xl md:text-2xl text-charcoal mb-8">Questions fréquentes</h2>
          <div className="space-y-3">
            {[
              { q: 'Est-ce que Yolanda est gratuit ?', a: 'Oui, totalement ! Yolanda ne prend aucune commission sur les ventes. Vous gardez 100% du prix de vente.' },
              { q: 'Comment sont organisées les rencontres ?', a: 'L\'acheteur et le vendeur conviennent directement d\'un lieu via WhatsApp. Nous recommandons les lieux publics.' },
              { q: 'Quels moyens de paiement sont acceptés ?', a: 'Les transactions se font directement entre particuliers. Espèces, MTN Mobile Money et Orange Money sont les plus utilisés.' },
              { q: 'Puis-je vendre des articles neufs ?', a: 'Absolument ! Vous pouvez vendre des articles neufs avec étiquette, comme neufs ou de seconde main.' },
              { q: 'Comment signaler un problème ?', a: 'Vous pouvez signaler un article ou un utilisateur directement depuis la fiche produit. Notre équipe examine chaque signalement.' },
            ].map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </Section>

      {/* Bandeau final */}
      <section className="bg-black-solid py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-4xl text-white mb-4">
            Prêt(e) à commencer ?
          </h2>
          <p className="text-sm text-gray-light mb-8 max-w-md mx-auto leading-relaxed">
            Rejoignez des milliers de Camerounaises qui donnent une seconde vie à leurs vêtements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="bg-terracotta hover:bg-terracotta-hover text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">Créer mon compte</Link>
            <Link to="/search" className="border border-white text-white hover:bg-white hover:text-charcoal text-sm font-medium px-6 py-3 rounded-full transition-colors">Explorer sans compte</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Helpers ── */
function Section({ bg, children }) {
  return <section className={bg}>{children}</section>
}

function TipBox({ children }) {
  return <div className="bg-terracotta-light/30 border border-terracotta/20 rounded-xl p-5">{children}</div>
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-cream rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-charcoal hover:text-terracotta transition-colors"
      >
        {q}
        <ChevronDown size={16} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-medium leading-relaxed">{a}</div>
      )}
    </div>
  )
}


