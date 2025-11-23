import { Button, Card, Group, Modal, Text, Title, Stack, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AddTransaction, { CreateTransactionFormData } from "./AddTransaction";
import { AccountSummary } from "@/features/accounts/api";
import { useCreateTransaction } from "../api/mutations";
import { IconPlus, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";

interface AccountDetailsProps {
  account: AccountSummary;
}

function AccountDetails({ account }: AccountDetailsProps) {
  const theme = useMantineTheme();
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
  const balanceColor = isPositive 
    ? (theme.other?.positiveBalance || theme.colors.green[5])
    : (theme.other?.negativeBalance || theme.colors.red[5]);
  const incomeColor = theme.colors.green[5];
  const expenseColor = theme.colors.red[5];
  const incomeBg = theme.colors.green[0];
  const expenseBg = theme.colors.red[0];

  return (
    <>
      <Card 
        withBorder 
        radius="md" 
        className="mb-4"
        shadow="sm"
        style={{
          background: theme.other?.cardBackground || '#ffffff',
        }}
      >
        <Group justify="space-between">
          <div>
            <Text size="sm" c="dimmed" fw={500}>Current Balance</Text>
            <Title order={2} c={balanceColor} fw={700} mt={4}>{account.balance.toLocaleString()}</Title>
          </div>
          <Button 
            onClick={openTransactionModal}
            leftSection={<IconPlus size={18} />}
            style={{
              background: `linear-gradient(135deg, ${theme.colors.blue[5]} 0%, ${theme.colors.blue[6]} 100%)`,
              transition: 'all 0.2s ease',
            }}
          >
            Add Transaction
          </Button>
        </Group>
      </Card>
      <Stack gap="sm" className="mb-4">
        <Text size="lg" fw={600}>Summary</Text>
        <Group gap="md" grow>
          <Card 
            withBorder 
            radius="md" 
            p="sm" 
            shadow="xs"
            style={{ 
              borderColor: incomeColor, 
              backgroundColor: incomeBg,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.md;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <Stack gap={4}>
              <Group gap={4}>
                <IconTrendingUp size={16} color={incomeColor} />
                <Text size="xs" c="dimmed" fw={500}>Income</Text>
              </Group>
              <Title order={4} c={incomeColor} fw={700}>{account.income.toLocaleString()}</Title>
            </Stack>
          </Card>
          <Card 
            withBorder 
            radius="md" 
            p="sm" 
            shadow="xs"
            style={{ 
              borderColor: expenseColor, 
              backgroundColor: expenseBg,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.md;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <Stack gap={4}>
              <Group gap={4}>
                <IconTrendingDown size={16} color={expenseColor} />
                <Text size="xs" c="dimmed" fw={500}>Expense</Text>
              </Group>
              <Title order={4} c={expenseColor} fw={700}>{account.expense.toLocaleString()}</Title>
            </Stack>
          </Card>
        </Group>
      </Stack>
      <Modal 
        opened={transactionModalOpened} 
        onClose={handleClose} 
        title="Add Transaction"
        size="md"
        radius="md"
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

