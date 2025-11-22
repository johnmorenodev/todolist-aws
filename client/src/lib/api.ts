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


