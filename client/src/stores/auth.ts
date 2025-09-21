import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'

type MeResponse = { authenticated: boolean; username?: string }

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false)
  const username = ref<string | null>(null)
  const initializing = ref<boolean>(true)

  async function bootstrap() {
    try {
      const { data } = await api.get<MeResponse>('/auth/me')
      isAuthenticated.value = data.authenticated
      username.value = data.username ?? null
    } catch {
      isAuthenticated.value = false
      username.value = null
    } finally {
      initializing.value = false
    }
  }

  async function tryRefresh(): Promise<boolean> {
    try {
      await api.post('/auth/refresh')
      return true
    } catch {
      return false
    }
  }

  async function login(u: string, p: string) {
    // Ensure CSRF cookie exists
    try { await api.get('/auth/csrf') } catch {}
    await api.post('/auth/login', { username: u, password: p })
    await bootstrap()
  }

  async function logout() {
    // Ensure CSRF token cookie exists before POSTing
    try { await api.get('/auth/csrf') } catch {}
    await api.post('/auth/logout')
    isAuthenticated.value = false
    username.value = null
  }

  return { isAuthenticated, username, initializing, bootstrap, tryRefresh, login, logout }
})


