import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreateAccountRequest } from "../components/AddAccountForm";
import { queryClient } from "@/lib/query-client";
import { accountQueryKeys } from "./queryKeys";

// API Functions
export async function createAccount(payload: CreateAccountRequest) {
  await api.post<void>("/account", payload);
}

// React Query Mutation Hooks
export function useCreateAccount() {
    return useMutation({
      mutationFn: async (payload: CreateAccountRequest) => {
        await createAccount(payload);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: accountQueryKeys.list() });
      },
    });
  }