import { useParams, useNavigate } from "react-router-dom";
import { useAccountSummary } from "@/hooks/accounts/queries";
import { Text, ActionIcon } from "@mantine/core";
import AccountDetails from "@/features/accounts/components/AccountDetails";
import RecentTransactions from "@/features/accounts/components/RecentTransactions";

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
        <ActionIcon variant="subtle" onClick={() => navigate("/accounts")} className="mt-4" size="lg">
          ←
        </ActionIcon>
      </>
    );
  }

  return (
    <>
      <ActionIcon variant="subtle" onClick={() => navigate("/accounts")} className="mb-2" size="lg">
        ←
      </ActionIcon>
      <Text size="xl" fw={600} className="mb-4">
        {accountSummary.name}
      </Text>
      <AccountDetails account={accountSummary} />
      <RecentTransactions accountId={accountIdNum} />
    </>
  );
}

export default AccountDetail;

