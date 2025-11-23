import AccountCard from "@/features/accounts/components/AccountCard";
import { useAccountList } from "@/hooks/accounts/queries";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AddAccountForm from "@/features/accounts/components/AddAccountForm";

function Accounts() {
  const { data: accounts, isLoading, isError, error } = useAccountList();
  const [accountModalOpened, { open: openAccountModal, close: closeAccountModal }] = useDisclosure(false);

  return (
    <div className="mx-4">
      {isLoading && <div>Loading...</div>}
      {isError && (
        <div className="text-red-500">
          {(error as any)?.message || "Failed to load accounts"}
        </div>
      )}
      {!isLoading && !isError && (
        <>
          {accounts && <AccountCard data={accounts} />}
          <Button onClick={openAccountModal} className="mt-4">Add Account</Button>
        </>
      )}
      <AddAccountForm opened={accountModalOpened} open={openAccountModal} close={closeAccountModal} />
    </div>
  );
}

export default Accounts;
