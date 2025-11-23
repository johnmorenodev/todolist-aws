import { Text, Stack, Group, Anchor } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useRecentTransactions } from "@/hooks/accounts/transactionQueries";
import TransactionCard from "./TransactionCard";

interface RecentTransactionsProps {
  accountId: number;
}

function RecentTransactions({ accountId }: RecentTransactionsProps) {
  const navigate = useNavigate();
  const { data: transactions, isLoading, isError } = useRecentTransactions(accountId, 10);

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
      ) : isError ? (
        <Text c="red">Error loading transactions</Text>
      ) : hasTransactions ? (
        <Stack gap="sm">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </Stack>
      ) : (
        <Text c="dimmed">No Recent Transactions</Text>
      )}
    </Stack>
  );
}

export default RecentTransactions;

