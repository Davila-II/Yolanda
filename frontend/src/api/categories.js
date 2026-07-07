// src/api/categories.js
import client from './client'

const USE_MOCK = !import.meta.env.VITE_API_URL

const MOCK_CATEGORIES = [
  {
    id: 1, name: 'Femmes', slug: 'femmes',
    subcategories: [
      { name: 'Vêtements', children: ['Robes', 'Tops & T-shirts', 'Chemises & Blouses', 'Jeans', 'Pantalons', 'Jupes', 'Vestes & Manteaux', 'Pulls & Sweats', 'Combinaisons'] },
      { name: 'Chaussures', children: ['Escarpins', 'Sandales', 'Baskets', 'Bottes', 'Ballerines', 'Mocassins'] },
      { name: 'Sacs & Accessoires', children: ['Sacs à main', 'Ceintures', 'Foulards', 'Bijoux', 'Lunettes'] },
      { name: 'Tenues traditionnelles', children: ['Robes en wax', 'Boubous', 'Ensembles pagne'] },
    ]
  },
  {
    id: 2, name: 'Hommes', slug: 'hommes',
    subcategories: [
      { name: 'Vêtements', children: ['T-shirts & Polos', 'Chemises', 'Pantalons', 'Jeans', 'Vestes', 'Costumes', 'Pulls & Sweats', 'Shorts'] },
      { name: 'Chaussures', children: ['Baskets', 'Mocassins', 'Sandales', 'Boots', 'Chaussures habillées'] },
      { name: 'Accessoires', children: ['Ceintures', 'Montres', 'Lunettes', 'Casquettes', 'Sacs'] },
    ]
  },
  {
    id: 3, name: 'Enfants', slug: 'enfants',
    subcategories: [
      { name: 'Filles', children: ['Robes', 'Tops', 'Pantalons', 'Jupes', 'Manteaux'] },
      { name: 'Garçons', children: ['T-shirts', 'Pantalons', 'Shorts', 'Vestes'] },
      { name: 'Bébé 0-2 ans', children: ['Bodies', 'Pyjamas', 'Ensembles', 'Chaussures bébé'] },
      { name: 'Chaussures enfants', children: ['Baskets', 'Sandales', 'Ballerines', 'Boots'] },
    ]
  },
  {
    id: 4, name: 'Chaussures', slug: 'chaussures',
    subcategories: [
      { name: 'Femmes', children: ['Escarpins', 'Sandales', 'Baskets', 'Bottes', 'Ballerines'] },
      { name: 'Hommes', children: ['Baskets', 'Mocassins', 'Boots', 'Chaussures habillées'] },
      { name: 'Enfants', children: ['Baskets', 'Sandales', 'Ballerines'] },
    ]
  },
  {
    id: 5, name: 'Sacs & Accessoires', slug: 'sacs-accessoires',
    subcategories: [
      { name: 'Sacs', children: ['Sacs à main', 'Sacs à dos', 'Pochettes', 'Sacs de sport', 'Sacs de voyage'] },
      { name: 'Accessoires', children: ['Montres', 'Bijoux', 'Ceintures', 'Foulards', 'Chapeaux & Casquettes', 'Lunettes'] },
    ]
  },
  {
    id: 6, name: 'Beauté', slug: 'beaute',
    subcategories: [
      { name: 'Soins', children: ['Soins visage', 'Soins corps', 'Soins cheveux', 'Parfums'] },
      { name: 'Maquillage', children: ['Fond de teint', 'Rouges à lèvres', 'Mascara', 'Fards à paupières'] },
    ]
  },
]

export const getCategories = () =>
  USE_MOCK ? Promise.resolve({ data: { data: MOCK_CATEGORIES } }) : client.get('/categories')

export const getCategory = (slug) =>
  USE_MOCK
    ? Promise.resolve({ data: { data: MOCK_CATEGORIES.find(c => c.slug === slug) || null } })
    : client.get(`/categories/${slug}`)
