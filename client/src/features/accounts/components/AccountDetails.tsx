import { Button, Card, Group, Modal, Text, Title, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AddTransaction, { CreateTransactionFormData } from "./AddTransaction";
import { AccountSummary } from "@/features/accounts/api";
import { useCreateTransaction } from "../api/mutations";

interface AccountDetailsProps {
  account: AccountSummary;
}

function AccountDetails({ account }: AccountDetailsProps) {
  const [transactionModalOpened, { open: openTransactionModal, close: closeTransactionModal }] = useDisclosure(false);
  const createTransactionMutation = useCreateTransaction();

  function handleSaveTransaction(values: CreateTransactionFormData) {
    const transactionDate = new Date(values.transactionDate);
    transactionDate.setHours(0, 0, 0, 0);
    
    createTransactionMutation.mutate(
      {
        amount: values.amount,
        transactionType: values.transactionType,
        accountId: account.accountId,
        description: values.description || undefined,
        transactionDate: transactionDate.toISOString(),
      },
      {
        onSuccess: () => {
          closeTransactionModal();
        },
      }
    );
  }

  function handleClose() {
    closeTransactionModal();
  }

  return (
    <>
      <Card withBorder radius="md" className="mb-4">
        <Group justify="space-between">
          <div>
            <Text size="sm" c="dimmed">Current Balance</Text>
            <Title order={2}>{account.balance.toLocaleString()}</Title>
          </div>
          <Button onClick={openTransactionModal}>+</Button>
        </Group>
      </Card>
      <Stack gap="md" className="mb-4">
        <Text size="lg" fw={500}>Summary</Text>
        <Group gap="md" grow>
          <Card withBorder radius="md" style={{ borderColor: '#51cf66', backgroundColor: '#f0f9f4' }}>
            <Stack gap="xs">
              <Text size="sm" c="dimmed">Income</Text>
              <Title order={3} c="#51cf66">{account.income.toLocaleString()}</Title>
            </Stack>
          </Card>
          <Card withBorder radius="md" style={{ borderColor: '#ff6b6b', backgroundColor: '#fff5f5' }}>
            <Stack gap="xs">
              <Text size="sm" c="dimmed">Expense</Text>
              <Title order={3} c="#ff6b6b">{account.expense.toLocaleString()}</Title>
            </Stack>
          </Card>
        </Group>
      </Stack>
      <Modal 
        opened={transactionModalOpened} 
        onClose={handleClose} 
        title="Add Transaction"
        size="md"
      >
        <AddTransaction 
          key={transactionModalOpened ? "open" : "closed"}
          accountId={account.accountId} 
          onSuccess={handleSaveTransaction} 
        />
      </Modal>
    </>
  );
}

export default AccountDetails;

