import { api } from "@/lib/api";
import { CreateAccountRequest } from "../components/AddAccountForm";

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

export async function createAccount(payload: CreateAccountRequest) {
  return api.post<AccountSummary>("/account", payload);
}