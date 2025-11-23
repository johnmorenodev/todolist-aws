import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { transactionQueryKeys } from "./queryKeys";
import { createTransaction, CreateTransactionRequest } from "./index";
import { accountQueryKeys } from "@/features/accounts/api/queryKeys";

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
    },
  });
}

