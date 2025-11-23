import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { authQueryKeys } from './queryKeys'

// Types
export type MeData = { authenticated: boolean; username: string | null }

// API Functions
export async function authMe() {
  const { data } = await api.get<MeData>('/auth/me')
  return data
}

// React Query Hooks
export function useAuthMe() {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: async () => {
      return await authMe()
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

