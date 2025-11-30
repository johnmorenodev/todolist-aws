import { Text, Stack, Group, Anchor, useMantineTheme, Modal, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useRecentTransactions, Transaction } from "@/features/transactions/api/queries";
import TransactionCard from "./TransactionCard";
import AddTransaction, { CreateTransactionFormData } from "./AddTransaction";
import { useUpdateTransaction, useDeleteTransaction } from "../api/mutations";
import { IconClock } from "@tabler/icons-react";
import { useState } from "react";

interface RecentTransactionsProps {
  accountId: number;
  transactionTypeFilter?: "income" | "expense" | null;
}

function RecentTransactions({ accountId, transactionTypeFilter }: RecentTransactionsProps) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { data: transactions, isLoading, isError } = useRecentTransactions(accountId, 10, transactionTypeFilter || undefined);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  const hasTransactions = transactions && Array.isArray(transactions) && transactions.length > 0;

  function handleEdit(transaction: Transaction) {
    setSelectedTransaction(transaction);
    openEditModal();
  }

  function handleDelete(transaction: Transaction) {
    setSelectedTransaction(transaction);
    openDeleteModal();
  }

  function confirmDelete() {
    if (!selectedTransaction) return;

    deleteTransactionMutation.mutate(
      { id: selectedTransaction.id, accountId },
      {
        onSuccess: () => {
          closeDeleteModal();
          setSelectedTransaction(null);
        },
      }
    );
  }

  function handleCloseDeleteModal() {
    if (deleteTransactionMutation.isPending) return;
    closeDeleteModal();
    setSelectedTransaction(null);
  }

  function handleUpdateTransaction(values: CreateTransactionFormData) {
    if (!selectedTransaction) return;

    const transactionDate = new Date(values.transactionDate);
    transactionDate.setHours(0, 0, 0, 0);

    updateTransactionMutation.mutate(
      {
        id: selectedTransaction.id,
        accountId,
        payload: {
          amount: values.amount,
          transactionType: values.transactionType,
          description: values.description || undefined,
          transactionDate: transactionDate.toISOString(),
        },
      },
      {
        onSuccess: () => {
          closeEditModal();
          setSelectedTransaction(null);
        },
      }
    );
  }

  function handleCloseEditModal() {
    if (updateTransactionMutation.isPending) return;
    closeEditModal();
    setSelectedTransaction(null);
  }

  return (
    <Stack gap="sm">
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
            <TransactionCard 
              key={transaction.id} 
              transaction={transaction}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Stack>
      ) : (
        <Text c="dimmed">No Recent Transactions</Text>
      )}
      <Modal
        opened={editModalOpened}
        onClose={handleCloseEditModal}
        title="Edit Transaction"
        size="md"
        radius="md"
        closeOnClickOutside={!updateTransactionMutation.isPending}
        closeOnEscape={!updateTransactionMutation.isPending}
        withCloseButton={!updateTransactionMutation.isPending}
      >
        <AddTransaction
          key={selectedTransaction?.id || "new"}
          accountId={accountId}
          onSuccess={handleUpdateTransaction}
          initialData={selectedTransaction || undefined}
          isLoading={updateTransactionMutation.isPending}
        />
      </Modal>
      <Modal
        opened={deleteModalOpened}
        onClose={handleCloseDeleteModal}
        title="Delete Transaction"
        size="md"
        radius="md"
        closeOnClickOutside={!deleteTransactionMutation.isPending}
        closeOnEscape={!deleteTransactionMutation.isPending}
        withCloseButton={!deleteTransactionMutation.isPending}
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button 
              variant="subtle" 
              onClick={handleCloseDeleteModal}
              disabled={deleteTransactionMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              color="red" 
              onClick={confirmDelete} 
              loading={deleteTransactionMutation.isPending}
              disabled={deleteTransactionMutation.isPending}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

export default RecentTransactions;

