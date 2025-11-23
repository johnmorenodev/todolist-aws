import { useQuery } from '@tanstack/react-query'
import { getAccountList, AccountSummary } from '@/features/accounts/api'
import { queryKeys } from '@/constants/query-keys'

export function useAccountList() {
  return useQuery({
    queryKey: queryKeys.accounts.list(),
    queryFn: async () => {
      const { data } = await getAccountList()
      return data
    },
  })
}

