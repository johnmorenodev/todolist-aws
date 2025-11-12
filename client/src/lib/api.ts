import axios, { AxiosRequestConfig } from 'axios'
import { authRefresh } from '@/api/auth'

declare module 'axios' {
  // augment to mark retry requests
  export interface AxiosRequestConfig {
    __isRetryRequest?: boolean
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

async function ensureCsrf() {
  if (typeof document !== 'undefined' && document.cookie.includes('XSRF-TOKEN=')) return
  try {
    await api.get('/auth/csrf')
  } catch {
    // no-op
  }
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase()
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    await ensureCsrf()
  }
  return config
})

let isRefreshing = false
let pendingRequests: Array<() => void> = []

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original: AxiosRequestConfig | undefined = error.config
    if (!original || original.__isRetryRequest) {
      throw error
    }
    if (error.response && error.response.status === 401) {
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


