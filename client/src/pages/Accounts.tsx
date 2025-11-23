import AccountCard from "@/features/accounts/components/AccountCard";
import { useAccountList } from "@/features/accounts/api/queries";
import { Button, Title, Text, Stack, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AddAccountForm from "@/features/accounts/components/AddAccountForm";
import { IconPlus, IconWallet } from "@tabler/icons-react";

function Accounts() {
  const theme = useMantineTheme();
  const { data: accounts, isLoading, isError, error } = useAccountList();
  const [accountModalOpened, { open: openAccountModal, close: closeAccountModal }] = useDisclosure(false);

  return (
    <Stack gap="lg">
      <div>
        <Title 
          order={1} 
          fw={700}
          style={{ 
            fontSize: 'clamp(1.25rem, 4vw, 2rem)',
          }}
        >
          My Accounts
        </Title>
        <Text c="dimmed" size="sm" mt="xs" >
          Manage your financial accounts
        </Text>
      </div>
      {isLoading && <div>Loading...</div>}
      {isError && (
        <div className="text-red-500">
          {(error as any)?.message || "Failed to load accounts"}
        </div>
      )}
      {!isLoading && !isError && (
        <>
          {accounts && accounts.length > 0 ? (
            <AccountCard data={accounts} />
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <IconWallet size={64} color={theme.colors.gray[6]} style={{ opacity: 0.5 }} />
              <Text c="dimmed" mt="md">No accounts yet. Create your first account to get started!</Text>
            </div>
          )}
          <Button 
            onClick={openAccountModal} 
            leftSection={<IconPlus size={18} />}
            size="md"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.blue[5]} 0%, ${theme.colors.blue[6]} 100%)`,
              transition: 'all 0.2s ease',
            }}
          >
            Add Account
          </Button>
        </>
      )}
      <AddAccountForm opened={accountModalOpened} open={openAccountModal} close={closeAccountModal} />
    </Stack>
  );
}

export default Accounts;
