import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authLogin, authLogout, authRefresh, signup } from '@/api/auth'
import { queryKeys } from '@/constants/query-keys'
import { useAuthStore } from '@/stores/auth'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { username: string; password: string }) => {
      await authLogin(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
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
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
    },
  })
}

