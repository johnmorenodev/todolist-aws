import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { transactionQueryKeys } from "./queryKeys";
import { CreateTransactionRequest, UpdateTransactionRequest, Transaction } from "./queries";
import { accountQueryKeys } from "@/features/accounts/api/queryKeys";

// API Functions
export async function createTransaction(payload: CreateTransactionRequest) {
  await api.post<void>("/transaction", payload);
}

export async function updateTransaction(id: number, payload: UpdateTransactionRequest) {
  await api.put<void>(`/transaction/${id}`, payload);
}

export async function deleteTransaction(id: number) {
  await api.delete<void>(`/transaction/${id}`);
}

// React Query Mutation Hooks
export function useCreateTransaction() {
  return useMutation({
    mutationFn: async (payload: CreateTransactionRequest) => {
      await createTransaction(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.summary(variables.accountId) });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.recent(variables.accountId) });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.list(variables.accountId) });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.byAccount(variables.accountId) });
    },
  });
}

export function useUpdateTransaction() {
  return useMutation({
    mutationFn: async ({ id, payload, accountId }: { id: number; payload: UpdateTransactionRequest; accountId: number }) => {
      await updateTransaction(id, payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.summary(variables.accountId) });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.recent(variables.accountId) });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.list(variables.accountId) });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.byAccount(variables.accountId) });
    },
  });
}

export function useDeleteTransaction() {
  return useMutation({
    mutationFn: async ({ id, accountId }: { id: number; accountId: number }) => {
      await deleteTransaction(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.summary(variables.accountId) });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.recent(variables.accountId) });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.list(variables.accountId) });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.byAccount(variables.accountId) });
    },
  });
}

