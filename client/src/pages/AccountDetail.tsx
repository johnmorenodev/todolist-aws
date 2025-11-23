import { useParams, useNavigate } from "react-router-dom";
import { useAccountList } from "@/hooks/accounts/queries";
import { Text, ActionIcon } from "@mantine/core";
import AccountDetails from "@/features/accounts/components/AccountDetails";
import RecentTransactions from "@/features/accounts/components/RecentTransactions";

function AccountDetail() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const { data: accounts, isLoading, isError } = useAccountList();

  const account = accounts?.find((acc) => acc.accountId === Number(accountId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !account) {
    return (
      <div className="mx-4">
        <div className="text-red-500">Account not found</div>
        <ActionIcon variant="subtle" onClick={() => navigate("/accounts")} className="mt-4" size="lg">
          ←
        </ActionIcon>
      </div>
    );
  }

  return (
    <div className="mx-4">
      <ActionIcon variant="subtle" onClick={() => navigate("/accounts")} className="mb-4" size="lg">
        ←
      </ActionIcon>
      <Text size="xl" fw={600} className="mb-4">
        {account.name}
      </Text>
      <AccountDetails account={account} />
      <RecentTransactions accountId={account.accountId} />
    </div>
  );
}

export default AccountDetail;

