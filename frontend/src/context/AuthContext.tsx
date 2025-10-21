import { createContext, useContext, useEffect, useState } from 'react'
import api, { setAuthToken } from '../lib/api'

type User = {
  id: number
  email: string
  name: string
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  register: (payload: {
    email: string
    password: string
    name: string
    birthDate: string
    birthTime: string
    birthPlace: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('astro_token')
    if (token) {
      setAuthToken(token)
      api
        .get('/users/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          setAuthToken(null)
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const token = res.data.access_token as string
      setAuthToken(token)
      const profile = await api.get('/users/me')
      setUser(profile.data)
    } catch (error) {
      setAuthToken(null)
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload: {
    email: string
    password: string
    name: string
    birthDate: string
    birthTime: string
    birthPlace: string
  }) => {
    const birthTime = payload.birthTime ? (payload.birthTime.length === 5 ? `${payload.birthTime}:00` : payload.birthTime) : null
    await api.post('/auth/register', {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      birth_date: payload.birthDate,
      birth_time: birthTime,
      birth_place: payload.birthPlace,
    })
    await login({ email: payload.email, password: payload.password })
  }

  const logout = () => {
    setAuthToken(null)
    setUser(null)
    setLoading(false)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
