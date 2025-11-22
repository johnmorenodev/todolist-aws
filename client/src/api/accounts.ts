import { api } from "@/lib/api";

export type AccountSummary = {
  name: string;
  income: number;
  expense: number;
  balance: number;
  accountId: number;
};

export async function getAccountList() {
  return api.get<AccountSummary[]>("/account");
}
