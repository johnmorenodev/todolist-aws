import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { authQueryKeys } from './queryKeys'
import { useAuthStore } from '@/stores/auth'

// API Functions
export async function authLogin(payload: { username: string; password: string }) {
  await api.post<void>('/auth/login', payload)
}

export async function authLogout() {
  await api.post<void>('/auth/logout')
}

export async function authRefresh() {
  await api.post<void>('/auth/refresh')
}

export async function signup(payload: {
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
}) {
  await api.post<void>('/auth/signup', payload)
}

// React Query Mutation Hooks
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { username: string; password: string }) => {
      await authLogin(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.me() })
    },
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: async (payload: {
      email: string
      username: string
      password: string
      firstName: string
      lastName: string
    }) => {
      await signup(payload)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return useMutation({
    mutationFn: async () => {
      await authLogout()
    },
    onSuccess: () => {
      queryClient.clear()
      clearAuth()
    },
  })
}

export function useRefresh() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await authRefresh()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.me() })
    },
  })
}

