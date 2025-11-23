/*
* Tanstack queries related to accounts
*/

import { useQuery } from "@tanstack/react-query";
import { getAccountList } from "@/features/accounts/api";
import { accountQueryKeys } from "./queryKeys";

export function useAccountList() {
  return useQuery({
    queryKey: accountQueryKeys.list(),
    queryFn: async () => {
      const { data } = await getAccountList();
      return data;
    },
  });
}

