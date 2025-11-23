import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { api } from "@/lib/api";
import { transactionQueryKeys } from './queryKeys'

// Types
export type Transaction = {
  id: number;
  amount: number;
  transactionType: string;
  description: string | null;
  transactionDate: string | null;
  createdAt: string;
};

export type CreateTransactionRequest = {
  amount: number;
  transactionType: string;
  accountId: number;
  description?: string;
  transactionDate?: string;
};

export type TransactionFilter = {
  search?: string;
  startDate?: string;
  endDate?: string;
  transactionType?: string;
};

// API Functions
export async function getRecentTransactions(accountId: number, limit: number = 10) {
  const { data } = await api.get<Transaction[]>(`/transaction/account/${accountId}/recent?limit=${limit}`);
  return data;
}

export async function getTransactionsList(
  accountId: number,
  page: number = 0,
  size: number = 20,
  filter?: TransactionFilter
) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());
  if (filter?.search) params.append("search", filter.search);
  if (filter?.startDate) params.append("startDate", filter.startDate);
  if (filter?.endDate) params.append("endDate", filter.endDate);
  if (filter?.transactionType && filter.transactionType !== "all") {
    params.append("transactionType", filter.transactionType);
  }
  
  const { data } = await api.get<Transaction[]>(`/transaction/account/${accountId}/list?${params.toString()}`);
  return data;
}

export async function createTransaction(payload: CreateTransactionRequest) {
  await api.post<void>("/transaction", payload);
}

// React Query Hooks
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

