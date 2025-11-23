import { Card, Text, Group, useMantineTheme } from "@mantine/core";
import { Transaction } from "../api/queries";
import { formatDate } from "@/utils/date";
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";

interface TransactionCardProps {
  transaction: Transaction;
}

function TransactionCard({ transaction }: TransactionCardProps) {
  const theme = useMantineTheme();
  const isIncome = transaction.transactionType === "income";
  const borderColor = isIncome ? theme.colors.green[5] : theme.colors.red[5];
  const backgroundColor = isIncome ? theme.colors.green[0] : theme.colors.red[0];
  const textColor = isIncome ? theme.colors.green[5] : theme.colors.red[5];

  return (
    <Card
      withBorder
      radius="md"
      p="sm"
      shadow="xs"
      style={{
        borderColor,
        backgroundColor,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(4px)';
        e.currentTarget.style.boxShadow = theme.shadows.md;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <Group justify="space-between" gap="sm">
        <Group gap="sm">
          {isIncome ? (
            <IconArrowUpRight size={20} color={textColor} />
          ) : (
            <IconArrowDownRight size={20} color={textColor} />
          )}
          <div>
            <Text size="xs" c="dimmed" fw={500}>
              {formatDate(transaction.transactionDate || transaction.createdAt)}
            </Text>
            <Text fw={500} size="sm" mt={2}>
              {transaction.description || "No description"}
            </Text>
          </div>
        </Group>
        <Text
          fw={700}
          size="md"
          c={textColor}
        >
          {isIncome ? "+" : "-"}
          {transaction.amount.toLocaleString()}
        </Text>
      </Group>
    </Card>
  );
}

export default TransactionCard;

