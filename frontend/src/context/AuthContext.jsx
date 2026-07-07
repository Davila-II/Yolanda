// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as authApi from '../api/auth.js'

const AuthContext = createContext(null)

function safeLocal(fn, fallback) {
  try { return fn() } catch { return fallback }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => safeLocal(() => localStorage.getItem('token'), null))
  const [isLoading, setIsLoading] = useState(true)

  // Restaure la session au montage
  useEffect(() => {
    safeLocal(() => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser))
          setToken(storedToken)
        } catch {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
    })
    setIsLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    const { user: u, token: t } = await authApi.login(credentials)
    setUser(u)
    setToken(t)
    return u
  }, [])

  const register = useCallback(async (data) => {
    const { user: u, token: t } = await authApi.register(data)
    setUser(u)
    setToken(t)
    return u
  }, [])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
    setToken(null)
  }, [])

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    // Fallback non connecté (utilisé avant montage du Provider)
    return {
      user: null,
      token: null,
      login: () => {},
      register: () => {},
      logout: () => {},
      isAuthenticated: false,
      isLoading: false,
    }
  }
  return ctx
}

export default AuthContext
