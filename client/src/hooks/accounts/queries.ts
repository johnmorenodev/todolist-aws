import { useQuery } from '@tanstack/react-query'
import { getAccountList, getAccountSummary, AccountListItem, AccountSummary } from '@/features/accounts/api'
import { accountQueryKeys } from '@/features/accounts/api/queryKeys'

export function useAccountList() {
  return useQuery({
    queryKey: accountQueryKeys.list(),
    queryFn: async () => {
      return await getAccountList()
    },
  })
}

export function useAccountSummary(accountId: number) {
  return useQuery({
    queryKey: accountQueryKeys.summary(accountId),
    queryFn: async () => {
      return await getAccountSummary(accountId)
    },
    enabled: !!accountId,
  })
}

