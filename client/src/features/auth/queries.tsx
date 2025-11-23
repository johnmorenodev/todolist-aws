import { useQuery } from '@tanstack/react-query'
import { authMe, MeData } from '@/api/auth'
import { queryKeys } from '@/constants/query-keys'

export function useAuthMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const { data } = await authMe()
      return data
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export type { MeData }

