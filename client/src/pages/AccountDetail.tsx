import { useParams, useNavigate } from "react-router-dom";
import { useAccountSummary } from "@/features/accounts/api/queries";
import { Text, ActionIcon, Title, Stack, Group } from "@mantine/core";
import AccountDetails from "@/features/accounts/components/AccountDetails";
import RecentTransactions from "@/features/transactions/components/RecentTransactions";
import { IconArrowLeft } from "@tabler/icons-react";

function AccountDetail() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const accountIdNum = accountId ? Number(accountId) : 0;
  const { data: accountSummary, isLoading: isLoadingSummary, isError: isErrorSummary } = useAccountSummary(accountIdNum);

  if (isLoadingSummary) {
    return <div>Loading account...</div>;
  }

  if (isErrorSummary || !accountSummary) {
    return (
      <>
        <div className="text-red-500">Account not found</div>
        <ActionIcon 
          variant="subtle" 
          onClick={() => navigate("/accounts")} 
          className="mt-4" 
          size="lg"
          color="blue"
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
      </>
    );
  }

  return (
    <Stack gap="sm">
      <Group gap="sm" align="center" wrap="nowrap">
        <ActionIcon 
          variant="subtle" 
          onClick={() => navigate("/accounts")} 
          size="md"
          style={{
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Title 
          order={1} 
          fw={700} 
          style={{ 
            flex: 1, 
            minWidth: 0,
            fontSize: 'clamp(1.125rem, 4vw, 1.75rem)',
          }}
        >
          {accountSummary.name}
        </Title>
      </Group>
      <AccountDetails account={accountSummary} />
      <RecentTransactions accountId={accountIdNum} />
    </Stack>
  );
}

export default AccountDetail;

