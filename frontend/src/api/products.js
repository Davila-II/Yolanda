// src/api/products.js — endpoints produits (mock pour le dev)
import client from './client'

const USE_MOCK = !import.meta.env.VITE_API_URL

function normalizeImages(products) {
  if (!products) return
  products.forEach(p => {
    if (p.images && Array.isArray(p.images)) {
      p.images = p.images.map(img => (typeof img === 'string' ? img : (img?.url || img)))
    }
  })
}

const MOCK_PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: ['Robe fleurie en wax', 'Blazer vintage', 'Jean mom taille haute', 'Sandales à talons', 'Sac à main en cuir', 'Chemise en lin blanc', 'Pull en cachemire', 'Jupe plissée midi', 'Basket tendance', 'Robe cocktail', 'T-shirt graphique', 'Ensemble pagne'][i],
  brand: ['Zara', "H&M", "Levi's", 'Mango', 'Nike', 'Adidas', 'Uniqlo', 'Pimkie', 'Bershka', 'Pull&Bear'][i % 10],
  size: ['S', 'M', 'L', 'XL', '38', '40', '42', '36'][i % 8],
  condition: ['new_with_tag', 'like_new', 'very_good', 'good', 'satisfactory'][i % 5],
  price: [4500, 12000, 8500, 15000, 22000, 9500, 18000, 6000, 11000, 25000, 3500, 14000][i],
  original_price: [15000, 35000, 25000, 30000, 45000, 20000, 40000, 15000, 28000, 60000, 10000, 30000][i],
  images: [],
  category: { id: (i % 6) + 1, name: ['Femmes', 'Hommes', 'Enfants', 'Chaussures', 'Sacs & Accessoires', 'Beauté'][i % 6], slug: ['femmes', 'hommes', 'enfants', 'chaussures', 'sacs-accessoires', 'beaute'][i % 6] },
  seller: { id: 1, name: 'Marie Kamga', username: 'mariekamga', avatar: null },
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  is_favorite: i % 3 === 0,
}))

export const getProducts = (params = {}) => {
  if (!USE_MOCK) return client.get('/products', { params }).then(res => {
    if (Array.isArray(res.data?.data)) normalizeImages(res.data.data)
    return res
  })
  return Promise.resolve({ data: { data: MOCK_PRODUCTS, meta: { total: 120, current_page: 1 } } })
}

export const getProduct = (id) => {
  if (!USE_MOCK) return client.get(`/products/${id}`).then(res => {
    const p = res.data?.data
    if (p) {
      if (p.images && Array.isArray(p.images)) {
        p.images = p.images.map(img => (typeof img === 'string' ? img : (img?.url || img)))
      }
      if (p.seller) {
        if (p.seller.received_reviews_avg_rating != null) p.seller.rating = p.seller.received_reviews_avg_rating
        if (p.seller.received_reviews_count != null) p.seller.review_count = p.seller.received_reviews_count
      }
    }
    return res
  })
  const p = MOCK_PRODUCTS.find(x => x.id === Number(id)) || MOCK_PRODUCTS[0]
  return Promise.resolve({ data: { data: { ...p, description: 'Superbe article en excellent état. Porté seulement quelques fois. Pas de défauts visibles.', seller: { ...p.seller, whatsapp: '+237 6XX XXX XXX', rating: 4.8, review_count: 24, sales_count: 56 } } } })
}

export const getSimilarProducts = (id) => {
  if (!USE_MOCK) return client.get(`/products/${id}/similar`).then(res => {
    if (Array.isArray(res.data?.data)) normalizeImages(res.data.data)
    return res
  })
  return Promise.resolve({ data: { data: MOCK_PRODUCTS.slice(0, 4) } })
}

export const createProduct = (data) =>
  USE_MOCK ? Promise.resolve({ data: { data: { id: 99, ...data } } }) : client.post('/products', data)

export const uploadProductImage = (productId, formData) =>
  USE_MOCK ? Promise.resolve({ data: { data: { id: 1, url: '' } } }) : client.post(`/products/${productId}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
