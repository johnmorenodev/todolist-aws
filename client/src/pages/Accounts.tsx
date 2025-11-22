import AccountCard from "@/features/accounts/AccountCard";
import { useAccountList } from "@/hooks/accounts/queries";

function Accounts() {
  const { data: accounts, isLoading, isError, error } = useAccountList();

  return (
    <div className="mx-4">
      {isLoading && <div>Loading...</div>}
      {isError && (
        <div className="text-red-500">
          {(error as any)?.message || "Failed to load accounts"}
        </div>
      )}
      {!isLoading && !isError && accounts && <AccountCard data={accounts} />}
    </div>
  );
}

export default Accounts;
