// src/pages/PublishProductPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Upload, Info, ImagePlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { createProduct, updateProduct, uploadProductImage, getProduct } from '../api/products.js'
import { getCategories } from '../api/categories.js'

const CONDITIONS = [
  { value: 'new_with_tag', label: 'Neuf avec étiquette' },
  { value: 'like_new', label: 'Comme neuf' },
  { value: 'very_good', label: 'Très bon état' },
  { value: 'good', label: 'Bon état' },
  { value: 'satisfactory', label: 'État satisfaisant' },
]

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Taille unique']

const inputBase = 'w-full bg-cream-dark rounded-xl px-4 py-3 text-sm text-charcoal placeholder:text-gray-light outline-none focus:ring-1 focus:ring-terracotta/30 transition-shadow'

export default function PublishProductPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const editId = searchParams.get('edit')
  const editingProduct = editId ? location.state?.product || null : null

  const [title, setTitle] = useState(editingProduct?.title || '')
  const [description, setDescription] = useState(editingProduct?.description || '')
  const [categoryId, setCategoryId] = useState(editingProduct?.category_id ?? null)
  const [categories, setCategories] = useState([])
  const [condition, setCondition] = useState(editingProduct?.condition || '')
  const [size, setSize] = useState(editingProduct?.size || '')
  const [brand, setBrand] = useState(editingProduct?.brand || '')
  const [color, setColor] = useState(editingProduct?.color || '')
  const [price, setPrice] = useState(editingProduct?.price != null ? String(editingProduct.price) : '')
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '')
  const [images, setImages] = useState([]) // [{ file, preview }] — nouvelles images
  const [loading, setLoading] = useState(!!editId && !editingProduct)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.data || [])).catch(() => {})
  }, [])

  // Mode édition : recharge l'annonce si on arrive sans état (ex. refresh de page)
  useEffect(() => {
    if (!editId || editingProduct) return
    getProduct(editId)
      .then((res) => {
        const p = res.data?.data || res.data
        setTitle(p.title || '')
        setDescription(p.description || '')
        setCategoryId(p.category_id ?? null)
        setCondition(p.condition || '')
        setSize(p.size || '')
        setBrand(p.brand || '')
        setColor(p.color || '')
        setPrice(p.price != null ? String(p.price) : '')
      })
      .catch(() => setError('Impossible de charger cette annonce.'))
      .finally(() => setLoading(false))
  }, [editId, editingProduct])

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024
  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files || [])
    const rejected = files.find((file) => file.size > MAX_IMAGE_SIZE || !ACCEPTED_TYPES.includes(file.type))
    if (rejected) {
      setError(
        rejected.size > MAX_IMAGE_SIZE
          ? `« ${rejected.name} » dépasse 5 Mo : choisissez une photo plus légère.`
          : `« ${rejected.name} » n'est pas une image valide (JPEG, PNG ou WEBP requis).`
      )
      e.target.value = ''
      return
    }
    const next = files.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    setImages((prev) => [...prev, ...next].slice(0, 5))
  }

  const removeImage = (idx) => setImages((prev) => {
    const item = prev[idx]
    if (item) URL.revokeObjectURL(item.preview)
    return prev.filter((_, i) => i !== idx)
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) { setError('Le titre est obligatoire.'); return }
    if (!categoryId) { setError('Choisissez une catégorie.'); return }
    if (!condition) { setError('Précisez l\'état de l\'article.'); return }
    if (!price || Number(price) < 100) { setError('Le prix doit être d\'au moins 100 FCFA.'); return }
    if (!whatsapp.trim()) { setError('Le numéro WhatsApp est obligatoire.'); return }

    setLoading(true)
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category_id: categoryId,
        condition,
        size,
        brand: brand.trim(),
        color: color.trim(),
        price: Number(price),
        whatsapp: whatsapp.trim(),
      }

      let product
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, payload)
        product = res.data?.data || res.data
      } else {
        const res = await createProduct(payload)
        product = res.data?.data || res.data
      }

      for (const { file } of images) {
        const formData = new FormData()
        formData.append('image', file)
        await uploadProductImage(product.id, formData)
      }

      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      const backendMsg = err?.response?.data?.errors?.image?.[0] || err?.response?.data?.message
      const imageHint = backendMsg && /image|upload/i.test(backendMsg)
        ? ' Vérifiez le format (JPEG, PNG, WEBP) et la taille (max 5 Mo).'
        : ''
      setError(backendMsg ? `${backendMsg}.${imageHint}` : 'Erreur lors de la publication.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-terracotta-light text-terracotta flex items-center justify-center mx-auto mb-4">
          <Upload size={28} />
        </div>
        <h1 className="font-serif text-2xl text-charcoal mb-2">{editingProduct ? 'Modifications enregistrées !' : 'Article publié !'}</h1>
        <p className="text-sm text-gray-medium">Redirection vers votre tableau de bord...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-serif text-2xl md:text-3xl text-charcoal mb-8">{editingProduct ? 'Modifier l\'article' : 'Ajouter un article'}</h1>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-error text-center">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* ── Photos ── */}
        <Section title="Photos">
          {editingProduct?.images?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {editingProduct.images.map((src, i) => (
                <div key={i} className="shrink-0 w-20 h-24 rounded-lg overflow-hidden bg-cream-dark">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-light rounded-xl p-8 text-center hover:border-terracotta/40 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageAdd}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <ImagePlus size={32} className="mx-auto text-gray-light mb-2" />
            <p className="text-sm text-gray-medium">Ajouter une photo</p>
            <p className="text-xs text-gray-light mt-1">Jusqu&rsquo;à 5 photos</p>
          </div>

          {images.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {images.map(({ preview }, i) => (
                <div key={i} className="relative shrink-0 w-20 h-24 rounded-lg overflow-hidden bg-cream-dark">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/50 text-white text-sm flex items-center justify-center">×</button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start gap-2 mt-3 bg-terracotta-light/30 rounded-lg p-3">
            <Info size={16} className="text-terracotta shrink-0 mt-0.5" />
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Prenez des photos claires sur un fond uni. Les articles bien présentés se vendent 3× plus vite !
            </p>
          </div>
        </Section>

        {/* ── Présentation ── */}
        <Section title="Présentation de ton article">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs text-gray-light uppercase tracking-wider">Titre</label>
              <span className={`text-xs ${title.length > 80 ? 'text-error' : 'text-gray-light'}`}>{title.length}/80</span>
            </div>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 80))}
              placeholder="Ex: Robe fleurie en wax — Taille M" className={inputBase} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs text-gray-light uppercase tracking-wider">Description</label>
              <span className={`text-xs ${description.length > 1000 ? 'text-error' : 'text-gray-light'}`}>{description.length}/1000</span>
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0, 1000))} rows={4}
              placeholder="Décrivez votre article : matière, couleur, défauts éventuels, pourquoi vous le vendez..."
              className={`${inputBase} resize-none`} />
          </div>
        </Section>

        {/* ── Détails ── */}
        <Section title="Détails de l'article">
          {/* Catégorie */}
          <div>
            <label className="block text-xs text-gray-light uppercase tracking-wider mb-2">Catégorie</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button key={cat.id} type="button" onClick={() => setCategoryId(cat.id)}
                  className={`text-sm py-3 px-4 rounded-xl border-2 transition-colors text-center ${
                    categoryId === cat.id ? 'border-terracotta bg-terracotta-light/30 text-terracotta font-medium' : 'border-cream-dark bg-cream-dark text-gray-medium hover:border-gray-light'
                  }`}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* État */}
          <div>
            <label className="block text-xs text-gray-light uppercase tracking-wider mb-2">État de l&rsquo;article</label>
            <div className="space-y-2">
              {CONDITIONS.map((c) => (
                <button key={c.value} type="button" onClick={() => setCondition(c.value)}
                  className={`w-full text-left text-sm py-3 px-4 rounded-xl border-2 transition-colors ${
                    condition === c.value ? 'border-terracotta bg-terracotta-light/30 text-terracotta font-medium' : 'border-cream-dark bg-cream-dark text-gray-medium hover:border-gray-light'
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Taille */}
          <div>
            <label className="block text-xs text-gray-light uppercase tracking-wider mb-2">Taille</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)}
                  className={`text-xs py-2 px-4 rounded-full border-2 transition-colors ${
                    size === s ? 'border-black-solid bg-black-solid text-white font-medium' : 'border-cream-dark bg-cream-dark text-gray-medium hover:border-gray-light'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Marque + Couleur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-light uppercase tracking-wider mb-1.5">Marque</label>
              <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Zara, H&M, Levi's..." className={inputBase} />
            </div>
            <div>
              <label className="block text-xs text-gray-light uppercase tracking-wider mb-1.5">Couleur</label>
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)}
                placeholder="Ex: Rouge, Bleu marine, Beige..." className={inputBase} />
            </div>
          </div>
        </Section>

        {/* ── Prix ── */}
        <Section title="Prix">
          <div>
            <label className="block text-xs text-gray-light uppercase tracking-wider mb-1.5">Prix de vente</label>
            <div className="relative">
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="0" min="100" className={`${inputBase} pr-12`} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-light">FCFA</span>
            </div>
            <p className="text-xs text-gray-light mt-1.5">
              Conseil : les articles entre 3 000 et 15 000 FCFA se vendent le plus rapidement.
            </p>
          </div>

          <div>
            <label className="block text-xs text-gray-light uppercase tracking-wider mb-1.5">Numéro WhatsApp</label>
            <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+237 6XX XXX XXX" className={inputBase} />
            <p className="text-xs text-gray-light mt-1.5">
              Les acheteurs vous contacteront via ce numéro.
            </p>
          </div>
        </Section>

        {/* ── Submit ── */}
        <div className="pt-4">
          <button type="submit" disabled={loading}
            className="w-full bg-black-solid hover:bg-charcoal text-white text-sm font-medium py-3.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Enregistrement...' : editingProduct ? 'Enregistrer les modifications' : 'Publier mon article'}
          </button>
          <p className="text-xs text-gray-light text-center mt-3">
            En publiant, vous acceptez les conditions générales d&rsquo;utilisation de Yolanda.
          </p>
        </div>
      </form>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-serif text-lg text-charcoal mb-4 pb-2 border-b border-cream-dark/50">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}
