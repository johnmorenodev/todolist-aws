import { useMutation } from "@tanstack/react-query";
import { CreateAccountRequest } from "../components/AddAccountForm";
import { createAccount } from ".";
import { queryClient } from "@/lib/query-client";
import { accountQueryKeys } from "./queryKeys";

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