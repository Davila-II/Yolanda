// src/api/reviews.js
import client from './client'

const USE_MOCK = !import.meta.env.VITE_API_URL

export const createReview = (data) =>
  USE_MOCK ? Promise.resolve({ data: { data: { id: 1, ...data } } }) : client.post('/reviews', data)
