import { Card, Text, Group } from "@mantine/core";
import { Transaction } from "../api/transactions";
import { formatDate } from "@/utils/date";

interface TransactionCardProps {
  transaction: Transaction;
}

function TransactionCard({ transaction }: TransactionCardProps) {
  const isIncome = transaction.transactionType === "income";

  return (
    <Card
      withBorder
      radius="md"
      p="sm"
      style={{
        borderColor: isIncome ? "#51cf66" : "#ff6b6b",
        backgroundColor: isIncome ? "#f0f9f4" : "#fff5f5",
      }}
    >
      <Group justify="space-between" gap="sm">
        <div>
          <Text size="xs" c="dimmed">
            {formatDate(transaction.transactionDate || transaction.createdAt)}
          </Text>
          <Text fw={500} size="sm">
            {transaction.description || "No description"}
          </Text>
        </div>
        <Text
          fw={600}
          size="md"
          c={isIncome ? "#51cf66" : "#ff6b6b"}
        >
          {isIncome ? "+" : "-"}
          {transaction.amount.toLocaleString()}
        </Text>
      </Group>
    </Card>
  );
}

export default TransactionCard;

