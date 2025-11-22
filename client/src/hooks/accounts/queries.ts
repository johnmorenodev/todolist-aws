import { useQuery } from '@tanstack/react-query'
import { getAccountList, AccountSummary } from '@/api/accounts'
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

