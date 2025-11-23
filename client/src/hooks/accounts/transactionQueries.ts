import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { getRecentTransactions, getTransactionsList, TransactionFilter } from '@/features/accounts/api/transactions'
import { transactionQueryKeys } from '@/features/accounts/api/queryKeys'

export function useRecentTransactions(accountId: number, limit: number = 10) {
  return useQuery({
    queryKey: transactionQueryKeys.recent(accountId),
    queryFn: async () => {
      return await getRecentTransactions(accountId, limit)
    },
    enabled: !!accountId,
  })
}

export function useAccountTransactionsInfinite(
  accountId: number,
  filter?: TransactionFilter
) {
  return useInfiniteQuery({
    queryKey: [...transactionQueryKeys.list(accountId), filter],
    queryFn: async ({ pageParam }) => {
      return await getTransactionsList(accountId, pageParam, 20, filter)
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) {
        return undefined
      }
      return allPages.length
    },
    initialPageParam: 0,
    enabled: !!accountId,
  })
}

