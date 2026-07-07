// src/pages/HomePage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Upload, MessageCircle, Handshake } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { getProducts } from '../api/products.js'

export default function HomePage() {
  const [newProducts, setNewProducts] = useState([])
  const [popularProducts, setPopularProducts] = useState([])

  useEffect(() => {
    getProducts({ sort: 'latest', per_page: 8 }).then((res) => {
      const prods = res.data.data
      setNewProducts(prods.slice(0, 6))
      setPopularProducts(prods.slice(0, 8))
    }).catch(() => {})
  }, [])

  return (
    <>
      {/* ═══ HERO ═══ */}
      <HeroSection />

      {/* ═══ NOUVEAUTÉS ═══ */}
      <SectionHeader
        title="Nouveautés"
        subtitle="Les derniers articles publiés"
        link="/search?sort=latest"
      />
      <section className="max-w-7xl mx-auto px-4 pb-6">
        {/* Mobile : scroll horizontal */}
        <div className="flex md:hidden gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {newProducts.map((p) => (
            <div key={p.id} className="w-[180px] shrink-0">
              <ProductCard product={p} showFavorite={false} />
            </div>
          ))}
        </div>
        {/* Desktop : grille 6 colonnes */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {newProducts.map((p) => (
            <ProductCard key={p.id} product={p} showFavorite={false} />
          ))}
        </div>
      </section>

      {/* ═══ COUPS DE CŒUR ═══ */}
      <SectionHeader
        title="Coups de cœur"
        subtitle="Les articles les plus populaires"
        link="/search?sort=popular"
      />
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {popularProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ═══ COMMENT FONCTIONNE YOLANDA ? ═══ */}
      <HowItWorksSection />

      {/* ═══ BANDEAU CTA ═══ */}
      <CTABanner />

      {/* ═══ FOOTER ═══ */}
      <Footer />
    </>
  )
}

/* ─────────────────────────────────────────────
   Sous-composants
   ───────────────────────────────────────────── */

function SectionHeader({ title, subtitle, link }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-12 pb-4">
      <div className="flex items-end justify-between mb-2">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-medium mt-1">{subtitle}</p>
          )}
        </div>
        {link && (
          <Link
            to={link}
            className="text-sm text-terracotta hover:text-terracotta-hover font-medium whitespace-nowrap transition-colors"
          >
            Tout voir →
          </Link>
        )}
      </div>
    </section>
  )
}

function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Colonne gauche — texte */}
        <div>
          <span className="inline-block text-xs text-terracotta font-medium uppercase tracking-widest mb-4">
            Mode de seconde main · Cameroun
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight mb-5">
            La mode circulaire,{' '}
            <span className="italic text-terracotta">sans compromis.</span>
          </h1>
          <p className="text-gray-medium max-w-md mb-8 text-sm sm:text-base leading-relaxed">
            Achetez et vendez des vêtements de seconde main entre particuliers.
            Zéro commission, contact direct via WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3 mb-10">
            <Link
              to="/search"
              className="bg-black-solid hover:bg-charcoal text-white text-sm font-medium px-6 py-3 rounded-full transition-colors text-center"
            >
              Explorer les articles →
            </Link>
            <Link
              to="/publish"
              className="border border-black-solid text-charcoal hover:bg-charcoal hover:text-white text-sm font-medium px-6 py-3 rounded-full transition-colors text-center"
            >
              Vendre une pièce
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 sm:gap-10 text-sm text-gray-medium">
            <span><strong className="text-charcoal">12k+</strong> articles disponibles</span>
            <span><strong className="text-charcoal">4 800</strong> vendeuses actives</span>
            <span><strong className="text-charcoal">98%</strong> avis positifs</span>
          </div>
        </div>

        {/* Colonne droite — collage */}
        <div className="hidden md:grid grid-cols-[1.2fr_1fr] gap-3 h-[400px] lg:h-[480px]">
          <div className="bg-cream-dark rounded-lg flex items-center justify-center h-full">
            <span className="text-gray-light text-sm">Photo mode</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="bg-cream-dark rounded-lg flex-1 flex items-center justify-center">
              <span className="text-gray-light text-xs">Photo 2</span>
            </div>
            <div className="bg-cream-dark rounded-lg flex-1 flex items-center justify-center">
              <span className="text-gray-light text-xs">Photo 3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Publiez votre article gratuitement',
      desc: 'Prenez de belles photos, décrivez votre article et fixez votre prix en quelques minutes.',
    },
    {
      number: '02',
      icon: MessageCircle,
      title: 'Soyez contacté sur WhatsApp',
      desc: 'Les acheteurs intéressés vous contactent directement via WhatsApp. Pratique et rapide.',
    },
    {
      number: '03',
      icon: Handshake,
      title: 'Rencontrez l\'acheteur & encaissez',
      desc: 'Convenez d\'un lieu de rencontre sécurisé. Zéro commission, vous gardez 100% de la vente.',
    },
  ]

  return (
    <section className="bg-cream-dark py-16 md:py-20 mt-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Texte */}
          <div>
            <span className="inline-block text-xs text-gray-medium uppercase tracking-widest mb-3">
              Simple & gratuit
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-4">
              Comment fonctionne Yolanda&nbsp;?
            </h2>
            <p className="text-sm text-gray-medium mb-6 leading-relaxed max-w-md">
              Vendre vos vêtements n&rsquo;a jamais été aussi simple. En trois
              étapes, vos articles trouvent une seconde vie et vous gagnez de
              l&rsquo;argent sans commission.
            </p>
            <Link
              to="/page/comment-ca-marche"
              className="inline-flex items-center gap-1 text-sm text-terracotta hover:text-terracotta-hover font-medium transition-colors"
            >
              En savoir plus <ArrowRight size={16} />
            </Link>
          </div>

          {/* Étapes */}
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-terracotta text-white shrink-0">
                  <span className="text-sm font-semibold font-sans">{step.number}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-charcoal mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CTABanner() {
  return (
    <section className="bg-black-solid py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="font-serif text-2xl md:text-4xl text-white mb-4">
          Votre garde-robe mérite une seconde vie.
        </h2>
        <p className="text-sm text-gray-light mb-8 max-w-md mx-auto leading-relaxed">
          Rejoignez des milliers de Camerounaises qui vendent et achètent
          leurs vêtements de seconde main en toute simplicité.
        </p>
        <Link
          to="/publish"
          className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-hover text-white text-sm font-medium px-8 py-3 rounded-full transition-colors"
        >
          Commencer à vendre <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="bg-black-solid text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-terracotta">
                <span className="font-serif text-cream font-bold text-base">Y</span>
              </span>
              <span className="font-serif text-cream text-xl font-semibold">Yolanda</span>
            </div>
            <p className="text-sm text-gray-light leading-relaxed mb-4">
              La marketplace camerounaise de mode de seconde main. Achetez et
              vendez sans commission.
            </p>
            <div className="flex gap-3 text-gray-light text-sm">
              <span>📷</span>
              <span>📘</span>
              <span>📌</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-light uppercase tracking-wider mb-4">Explorer</h4>
            <ul className="space-y-2 text-sm text-gray-light">
              <li><Link to="/category/femmes" className="hover:text-white transition-colors">Femmes</Link></li>
              <li><Link to="/category/hommes" className="hover:text-white transition-colors">Hommes</Link></li>
              <li><Link to="/category/enfants" className="hover:text-white transition-colors">Enfants</Link></li>
              <li><Link to="/category/chaussures" className="hover:text-white transition-colors">Chaussures</Link></li>
              <li><Link to="/category/sacs-accessoires" className="hover:text-white transition-colors">Sacs & Accessoires</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs text-gray-light uppercase tracking-wider mb-4">Vendre</h4>
            <ul className="space-y-2 text-sm text-gray-light">
              <li><Link to="/publish" className="hover:text-white transition-colors">Publier un article</Link></li>
              <li><Link to="/page/comment-ca-marche" className="hover:text-white transition-colors">Comment ça marche</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Créer un compte</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs text-gray-light uppercase tracking-wider mb-4">Aide</h4>
            <ul className="space-y-2 text-sm text-gray-light">
              <li><Link to="/page/confiance" className="hover:text-white transition-colors">Confiance & Sécurité</Link></li>
              <li><Link to="/page/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><a href="mailto:contact@yolanda.cm" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-light">
          <span>© {new Date().getFullYear()} Yolanda. Tous droits réservés.</span>
          <div className="flex gap-4">
            <Link to="/page/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link to="/page/cgu" className="hover:text-white transition-colors">CGU</Link>
            <Link to="/page/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
