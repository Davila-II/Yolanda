// src/api/favorites.js
import client from './client'

const USE_MOCK = !import.meta.env.VITE_API_URL

export const getFavorites = () =>
  USE_MOCK ? Promise.resolve({ data: { data: [] } }) : client.get('/favorites')

export const toggleFavorite = (productId) =>
  USE_MOCK
    ? Promise.resolve({ data: { data: { is_favorite: true } } })
    : client.post(`/favorites/${productId}`)
