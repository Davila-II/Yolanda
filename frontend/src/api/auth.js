// src/api/auth.js — endpoints d'authentification
// Mocké tant que le backend n'est pas prêt ; importe client.js pour les vrais appels

import client from './client'

// Mock activé tant que VITE_API_URL n'est pas défini
const USE_MOCK = !import.meta.env.VITE_API_URL

const mockLogin = async (credentials) => {
  // Simule latence réseau
  await new Promise(r => setTimeout(r, 200))

  if (credentials.email === 'test@yolanda.cm' && credentials.password === 'password') {
    const user = {
      id: 1,
      name: 'Marie Kamga',
      username: 'mariekamga',
      email: 'test@yolanda.cm',
      avatar: null,
      city: 'Douala',
      bio: 'Passionnée de mode circulaire ✨',
      whatsapp: '+237 6XX XXX XXX',
      role: 'user',
    }
    const token = 'mock-jwt-token-yolanda'
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    return { user, token }
  }

  // Compte admin mock
  if (credentials.email === 'admin@yolanda.cm' && credentials.password === 'admin') {
    const user = {
      id: 99,
      name: 'Admin Yolanda',
      username: 'admin',
      email: 'admin@yolanda.cm',
      avatar: null,
      city: 'Douala',
      bio: '',
      whatsapp: '',
      role: 'admin',
    }
    const token = 'mock-jwt-token-admin'
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    return { user, token }
  }

  throw { response: { status: 401, data: { message: 'Identifiants invalides.' } } }
}

const mockRegister = async (data) => {
  await new Promise(r => setTimeout(r, 300))
  const user = {
    id: 2,
    name: data.name,
    username: data.username || data.name.toLowerCase().replace(/\s+/g, ''),
    email: data.email,
    avatar: null,
    city: data.city || '',
    bio: '',
    whatsapp: data.whatsapp || '',
    role: 'user',
  }
  const token = 'mock-jwt-token-yolanda'
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  return { user, token }
}

export const login = (credentials) =>
  USE_MOCK ? mockLogin(credentials) : client.post('/auth/login', credentials)

export const register = (data) =>
  USE_MOCK ? mockRegister(data) : client.post('/auth/register', data)

export const getMe = () =>
  USE_MOCK
    ? Promise.resolve({ data: JSON.parse(localStorage.getItem('user') || 'null') })
    : client.get('/auth/me')

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
