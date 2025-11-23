import { api } from "@/lib/api";

export type Transaction = {
  id: number;
  amount: number;
  transactionType: string;
  description: string | null;
  transactionDate: string | null;
  createdAt: string;
};

export type CreateTransactionRequest = {
  amount: number;
  transactionType: string;
  accountId: number;
  description?: string;
  transactionDate?: string;
};

export async function getTransactionsByAccount(
  accountId: number, 
  limit: number = 10, 
  page: number = 0, 
  search?: string,
  startDate?: string,
  endDate?: string,
  transactionType?: string
) {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  params.append("page", page.toString());
  if (search) params.append("search", search);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (transactionType && transactionType !== "all") params.append("transactionType", transactionType);
  
  const { data } = await api.get<Transaction[]>(`/transaction/account/${accountId}?${params.toString()}`);
  return data;
}

export async function createTransaction(payload: CreateTransactionRequest) {
  return api.post("/transaction", payload);
}

