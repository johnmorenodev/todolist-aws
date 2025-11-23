import { create } from 'zustand'
import { MeData } from '@/features/auth/queries'

type AuthState = {
  isAuthenticated: boolean
  username: string | null
  setAuthData: (data: MeData) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  username: null,
  setAuthData: (data: MeData) => {
    set({ isAuthenticated: data.authenticated, username: data.username })
  },
  clearAuth: () => {
    set({ isAuthenticated: false, username: null })
  },
}))


