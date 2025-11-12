import { create } from 'zustand'
import { authMe, authRefresh, authLogin, authLogout } from '@/api/auth'

type AuthState = {
  isAuthenticated: boolean
  username: string | null
  initializing: boolean
  bootstrap: () => Promise<void>
  tryRefresh: () => Promise<boolean>
  login: (u: string, p: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  username: null,
  initializing: true,
  async bootstrap() {
    try {
      const { data } = await authMe()
      set({ isAuthenticated: data.authenticated, username: data.username ?? null })
    } catch {
      set({ isAuthenticated: false, username: null })
    } finally {
      set({ initializing: false })
    }
  },
  async tryRefresh() {
    try {
      await authRefresh()
      return true
    } catch {
      return false
    }
  },
  async login(u, p) {
    await authLogin({ username: u, password: p })
    await useAuthStore.getState().bootstrap()
  },
  async logout() {
    await authLogout()
    set({ isAuthenticated: false, username: null })
  },
}))


