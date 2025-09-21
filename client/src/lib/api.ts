import axios from 'axios'
import { authRefresh } from '@/api/auth'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

// Ensure CSRF cookie exists before mutating requests
async function ensureCsrf() {
  if (typeof document !== 'undefined' && document.cookie.includes('XSRF-TOKEN=')) return
  try { await api.get('/auth/csrf') } catch {}
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase()
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    await ensureCsrf()
  }
  return config
})

// Refresh on 401s transparently
let isRefreshing = false
let pendingRequests: Array<() => void> = []

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (!original || original.__isRetryRequest) {
      throw error
    }
    if (error.response && error.response.status === 401) {
      // If the 401 came from the refresh endpoint itself, don't try to refresh again
      const url = (original.url || '').toString()
      if (url.includes('/auth/refresh')) {
        throw error
      }
      if (isRefreshing) {
        await new Promise<void>((resolve) => pendingRequests.push(resolve))
        original.__isRetryRequest = true
        return api.request(original)
      }
      try {
        isRefreshing = true
        await authRefresh()
        pendingRequests.forEach((fn) => fn())
        pendingRequests = []
        original.__isRetryRequest = true
        return api.request(original)
      } catch (e) {
        pendingRequests = []
        throw e
      } finally {
        isRefreshing = false
      }
    }
    throw error
  },
)

// endpoint-specific helpers belong in dedicated services (see auth.ts)
