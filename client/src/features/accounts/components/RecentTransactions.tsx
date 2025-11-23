import { Card, Text, Stack, Group, Anchor } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getTransactionsByAccount } from "../api/transactions";
import { transactionQueryKeys } from "../api/queryKeys";
import { formatDate } from "@/utils/date";

interface RecentTransactionsProps {
  accountId: number;
}

function RecentTransactions({ accountId }: RecentTransactionsProps) {
  const navigate = useNavigate();
  const { data: transactions, isLoading, isError } = useQuery({
    queryKey: transactionQueryKeys.byAccount(accountId),
    queryFn: async () => {
      try {
        const result = await getTransactionsByAccount(accountId, 10);
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
      }
    },
  });

  const isIncome = (transactionType: string) => transactionType === "income";

  const hasTransactions = transactions && Array.isArray(transactions) && transactions.length > 0;

  return (
    <Stack gap={4} className="mb-4">
      <Group justify="space-between" align="center">
        <Text size="lg" fw={500}>
          Recent Transactions
        </Text>
        <Anchor
          size="sm"
          onClick={() => navigate(`/accounts/${accountId}/transactions`)}
          style={{ cursor: "pointer" }}
        >
          See more
        </Anchor>
      </Group>
      {isLoading ? (
        <Text>Loading transactions...</Text>
      ) : hasTransactions ? (
        <Stack gap="sm">
          {transactions.map((transaction) => {
            const income = isIncome(transaction.transactionType);
            return (
              <Card
                key={transaction.id}
                withBorder
                radius="md"
                p="md"
                style={{
                  borderColor: income ? "#51cf66" : "#ff6b6b",
                  backgroundColor: income ? "#f0f9f4" : "#fff5f5",
                }}
              >
                <Group justify="space-between">
                  <div>
                    <Text size="sm" c="dimmed">
                      {formatDate(transaction.transactionDate || transaction.createdAt)}
                    </Text>
                    <Text fw={500} size="md">
                      {transaction.description || "No description"}
                    </Text>
                  </div>
                  <Text
                    fw={600}
                    size="lg"
                    c={income ? "#51cf66" : "#ff6b6b"}
                  >
                    {income ? "+" : "-"}
                    {transaction.amount.toLocaleString()}
                  </Text>
                </Group>
              </Card>
            );
          })}
        </Stack>
      ) : (
        <Text c="dimmed">No Recent Transactions</Text>
      )}
    </Stack>
  );
}

export default RecentTransactions;

