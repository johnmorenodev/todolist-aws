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

  const isPositive = account.balance >= 0;
  const balanceColor = isPositive ? "#51cf66" : "#ff6b6b";

  return (
    <>
      <Card withBorder radius="md" className="mb-4">
        <Group justify="space-between">
          <div>
            <Text size="sm" c="dimmed">Current Balance</Text>
            <Title order={2} c={balanceColor}>{account.balance.toLocaleString()}</Title>
          </div>
          <Button onClick={openTransactionModal}>+</Button>
        </Group>
      </Card>
      <Stack gap="sm" className="mb-4">
        <Text size="lg" fw={500}>Summary</Text>
        <Group gap="md" grow>
          <Card withBorder radius="md" p="sm" style={{ borderColor: '#51cf66', backgroundColor: '#f0f9f4' }}>
            <Stack gap={4}>
              <Text size="xs" c="dimmed">Income</Text>
              <Title order={4} c="#51cf66">{account.income.toLocaleString()}</Title>
            </Stack>
          </Card>
          <Card withBorder radius="md" p="sm" style={{ borderColor: '#ff6b6b', backgroundColor: '#fff5f5' }}>
            <Stack gap={4}>
              <Text size="xs" c="dimmed">Expense</Text>
              <Title order={4} c="#ff6b6b">{account.expense.toLocaleString()}</Title>
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

