import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { authRefresh } from '@/api/auth'
import { ApiResponse, ApiErrorResponse } from '@/types/api'

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

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const cookies = document.cookie ? document.cookie.split('; ') : []
  for (const cookie of cookies) {
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1))
    }
  }
  return null
}

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
    if (typeof document !== 'undefined') {
      const token = getCookie('XSRF-TOKEN')
      if (token) {
        config.headers = config.headers ?? {}
        ;(config.headers as any)['X-XSRF-TOKEN'] = token
      }
    }
  }
  return config
})

let isRefreshing = false
let pendingRequests: Array<() => void> = []
let refreshTimer: NodeJS.Timeout | null = null

// Proactive token refresh - refresh tokens every 10 minutes (before 15-minute expiration)
function setupProactiveRefresh() {
  if (typeof window === 'undefined') return
  
  // Clear existing timer if any
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  
  // Refresh tokens every 10 minutes (600000 ms)
  refreshTimer = setInterval(async () => {
    if (!isRefreshing) {
      try {
        await authRefresh()
      } catch (error) {
        // Silently fail - if refresh fails, the next request will handle it
        console.debug('Proactive token refresh failed:', error)
      }
    }
  }, 10 * 60 * 1000) // 10 minutes
}

// Setup proactive refresh when module loads
if (typeof window !== 'undefined') {
  setupProactiveRefresh()
}

api.interceptors.response.use(
  (res: AxiosResponse<ApiResponse<any>>) => {
    if (res.data && res.data.success === true && 'data' in res.data) {
      return { ...res, data: res.data.data } as any
    }
    return res
  },
  async (error) => {
    const original: AxiosRequestConfig | undefined = error.config
    if (!original || original.__isRetryRequest) {
      if (error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse
        const enhancedError = new Error(errorData.message || 'An error occurred')
        ;(enhancedError as any).response = error.response
        ;(enhancedError as any).fieldErrors = errorData.errors
        throw enhancedError
      }
      throw error
    }
    if (error.response && error.response.status === 401) {
      const url = (original.url || '').toString()
      if (url.includes('/auth/refresh')) {
        const errorData = error.response.data as ApiErrorResponse
        const enhancedError = new Error(errorData.message || 'Unauthorized')
        ;(enhancedError as any).response = error.response
        ;(enhancedError as any).fieldErrors = errorData.errors
        throw enhancedError
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
        if ((e as any).response?.data) {
          const errorData = (e as any).response.data as ApiErrorResponse
          const enhancedError = new Error(errorData.message || 'Unauthorized')
          ;(enhancedError as any).response = (e as any).response
          ;(enhancedError as any).fieldErrors = errorData.errors
          throw enhancedError
        }
        throw e
      } finally {
        isRefreshing = false
      }
    }
    if (error.response?.data) {
      const errorData = error.response.data as ApiErrorResponse
      const enhancedError = new Error(errorData.message || 'An error occurred')
      ;(enhancedError as any).response = error.response
      ;(enhancedError as any).fieldErrors = errorData.errors
      throw enhancedError
    }
    throw error
  },
)


