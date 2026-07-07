import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// Helper sécurisé pour localStorage
function safeGetItem(key) {
  try { return localStorage.getItem(key) } catch { return null }
}
function safeRemoveItem(key) {
  try { localStorage.removeItem(key) } catch { /* ignore */ }
}

// Intercepteur JWT
client.interceptors.request.use((config) => {
  const token = safeGetItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur de réponse — gestion des erreurs 401
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      safeRemoveItem('token')
      safeRemoveItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
