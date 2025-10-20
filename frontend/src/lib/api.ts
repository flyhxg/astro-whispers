import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: false,
})

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('astro_token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('astro_token')
  }
}

export default api

