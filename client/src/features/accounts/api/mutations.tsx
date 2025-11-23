import { useMutation } from "@tanstack/react-query";
import { CreateAccountRequest } from "../components/AddAccountForm";
import { createAccount } from ".";
import { queryClient } from "@/lib/query-client";
import { accountQueryKeys, transactionQueryKeys } from "./queryKeys";
import { createTransaction, CreateTransactionRequest } from "./transactions";

export function useCreateAccount() {
    return useMutation({
      mutationFn: async (payload: CreateAccountRequest) => {
        const { data } = await createAccount(payload);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: accountQueryKeys.list() });
      },
    });
  }

export function useCreateTransaction() {
  return useMutation({
    mutationFn: async (payload: CreateTransactionRequest) => {
      await createTransaction(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.list() });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.byAccount(variables.accountId) });
    },
  });
}