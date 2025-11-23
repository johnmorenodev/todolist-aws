import { Text, Stack, Group, Anchor, useMantineTheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useRecentTransactions } from "@/features/transactions/api/queries";
import TransactionCard from "./TransactionCard";
import { IconClock } from "@tabler/icons-react";

interface RecentTransactionsProps {
  accountId: number;
}

function RecentTransactions({ accountId }: RecentTransactionsProps) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { data: transactions, isLoading, isError } = useRecentTransactions(accountId, 10);

  const hasTransactions = transactions && Array.isArray(transactions) && transactions.length > 0;

  return (
    <Stack gap="sm" className="mb-4">
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <IconClock size={20} color={theme.colors.gray[6]} />
          <Text size="lg" fw={600}>
            Recent Transactions
          </Text>
        </Group>
        <Anchor
          size="sm"
          onClick={() => navigate(`/accounts/${accountId}/transactions`)}
          c="blue"
          fw={600}
          style={{ 
            cursor: "pointer",
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
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

