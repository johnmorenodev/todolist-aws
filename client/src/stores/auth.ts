import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'
import { authMe, authRefresh, authLogin, authLogout } from '@/api/auth'


export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false)
  const username = ref<string | null>(null)
  const initializing = ref<boolean>(true)

  async function bootstrap() {
    try {
      const { data } = await authMe()
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
      await authRefresh()
      return true
    } catch {
      return false
    }
  }

  async function login(u: string, p: string) {
    await authLogin({ username: u, password: p })
    await bootstrap()
  }

  async function logout() {
    await authLogout()
    isAuthenticated.value = false
    username.value = null
  }

  return { isAuthenticated, username, initializing, bootstrap, tryRefresh, login, logout }
})


