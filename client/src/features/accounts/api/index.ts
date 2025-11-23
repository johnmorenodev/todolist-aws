import { api } from "@/lib/api";
import { CreateAccountRequest } from "../components/AddAccountForm";

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

export async function getAccountList() {
  const { data } = await api.get<AccountListItem[]>("/account");
  return data;
}

export async function getAccountSummary(accountId: number) {
  const { data } = await api.get<AccountSummary>(`/account/${accountId}/summary`);
  return data;
}

export async function createAccount(payload: CreateAccountRequest) {
  await api.post<void>("/account", payload);
}