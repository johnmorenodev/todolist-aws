import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
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
        // Ensure CSRF cookie exists before refresh POST
        try { await api.get('/auth/csrf') } catch {}
        isRefreshing = true
        await api.post('/auth/refresh')
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

export async function signup(payload: { email: string; username: string; password: string; firstName: string; lastName: string }) {
  try { await api.get('/auth/csrf') } catch {}
  return api.post('/auth/signup', payload)
}


