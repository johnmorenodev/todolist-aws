import { useQuery } from '@tanstack/react-query'
import { api } from "@/lib/api";
import { accountQueryKeys } from './queryKeys'

// Types
export type AccountListItem = {
  accountId: number;
  name: string;
  balance: number;
};

export type AccountSummary = {
  accountId: number;
  name: string;
  income: number;
  expense: number;
  balance: number;
};

// API Functions
export async function getAccountList() {
  const { data } = await api.get<AccountListItem[]>("/account");
  return data;
}

export async function getAccountSummary(accountId: number) {
  const { data } = await api.get<AccountSummary>(`/account/${accountId}/summary`);
  return data;
}

// React Query Hooks
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
