import { useParams, useNavigate } from "react-router-dom";
import { useAccountSummary } from "@/hooks/accounts/queries";
import { useAccountTransactionsInfinite } from "@/hooks/transactions/queries";
import { Text, ActionIcon, Stack, Group, TextInput, Select, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useRef, useState } from "react";
import { IconX, IconArrowLeft, IconSearch } from "@tabler/icons-react";
import TransactionCard from "@/features/transactions/components/TransactionCard";
import { TransactionFilter } from "@/features/transactions/api";

function AccountTransactions() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const accountIdNum = accountId ? Number(accountId) : 0;
  const { data: accountSummary, isLoading: isLoadingAccount } = useAccountSummary(accountIdNum);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getDateRange = () => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    
    switch (dateFilter) {
      case "last-day":
        const lastDay = new Date(now);
        lastDay.setDate(lastDay.getDate() - 1);
        lastDay.setHours(0, 0, 0, 0);
        return { start: lastDay, end: now };
      case "last-7-days":
        const last7Days = new Date(now);
        last7Days.setDate(last7Days.getDate() - 7);
        last7Days.setHours(0, 0, 0, 0);
        return { start: last7Days, end: now };
      case "last-30-days":
        const last30Days = new Date(now);
        last30Days.setDate(last30Days.getDate() - 30);
        last30Days.setHours(0, 0, 0, 0);
        return { start: last30Days, end: now };
      case "custom":
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          return { start, end };
        }
        return null;
      default:
        return null;
    }
  };

  const getDateRangeParams = () => {
    const dateRange = getDateRange();
    if (!dateRange) return { startDate: undefined, endDate: undefined };
    
    return {
      startDate: dateRange.start.toISOString(),
      endDate: dateRange.end.toISOString(),
    };
  };

  const dateParams = getDateRangeParams();
  const hasFilters = dateFilter !== "all" || transactionTypeFilter !== "all" || debouncedSearch.trim() !== "";

  const filter: TransactionFilter = {
    search: debouncedSearch.trim() || undefined,
    startDate: dateParams.startDate,
    endDate: dateParams.endDate,
    transactionType: transactionTypeFilter !== "all" ? transactionTypeFilter : undefined,
  };

  const infiniteQuery = useAccountTransactionsInfinite(accountIdNum, filter);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = infiniteQuery;

  const transactions = data?.pages.flat() || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setDateFilter("all");
    setTransactionTypeFilter("all");
    setCustomStartDate(null);
    setCustomEndDate(null);
  };

  if (isLoadingAccount) {
    return <div>Loading account...</div>;
  }

  if (!accountSummary) {
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
    <Stack gap="lg">
      <Group gap="sm" align="center" wrap="nowrap">
        <ActionIcon 
          variant="subtle" 
          onClick={() => navigate(`/accounts/${accountId}`)} 
          size="lg"
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
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={1} fw={700} style={{ flex: 1, minWidth: 0 }}>
          {accountSummary.name} - All Transactions
        </Title>
      </Group>
      <TextInput
        placeholder="Search by description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="md"
        leftSection={<IconSearch size={18} />}
        style={{
          background: 'white',
        }}
      />
      <Stack gap="sm" className="mb-4">
        <Group gap="md" align="flex-end">
          <Select
            label="Date Range"
            placeholder="Select date range"
            data={[
              { value: "all", label: "Show all" },
              { value: "last-day", label: "Last day" },
              { value: "last-7-days", label: "Last 7 days" },
              { value: "last-30-days", label: "Last 30 days" },
              { value: "custom", label: "Custom date range" },
            ]}
            value={dateFilter}
            onChange={(value) => {
              setDateFilter(value || "all");
              if (value !== "custom") {
                setCustomStartDate(null);
                setCustomEndDate(null);
              }
            }}
            size="md"
            style={{ flex: 1, background: 'white' }}
          />
          <Select
            label="Transaction Type"
            placeholder="Select type"
            data={[
              { value: "all", label: "Show all" },
              { value: "income", label: "Show income" },
              { value: "expense", label: "Show expense" },
            ]}
            value={transactionTypeFilter}
            onChange={(value) => setTransactionTypeFilter(value || "all")}
            size="md"
            style={{ flex: 1, background: 'white' }}
          />
          {hasFilters && (
            <ActionIcon
              variant="subtle"
              onClick={handleClearFilters}
              size="lg"
              title="Clear filters"
              style={{
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
            >
              <IconX size={18} />
            </ActionIcon>
          )}
        </Group>
        {dateFilter === "custom" && (
          <Group gap="md" grow>
            <DateInput
              label="Start Date"
              placeholder="Select start date"
              value={customStartDate}
              onChange={setCustomStartDate}
              size="md"
              style={{ background: 'white' }}
            />
            <DateInput
              label="End Date"
              placeholder="Select end date"
              value={customEndDate}
              onChange={setCustomEndDate}
              size="md"
              style={{ background: 'white' }}
            />
          </Group>
        )}
      </Stack>
      {isLoading ? (
        <Text>Loading transactions...</Text>
      ) : isError ? (
        <Text c="red">Error loading transactions</Text>
      ) : transactions.length === 0 ? (
        <Text c="dimmed">
          {hasFilters ? "No transactions found matching your filters" : "No transactions found"}
        </Text>
      ) : (
        <Stack gap="sm">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
          <div ref={loadMoreRef}>
            {isFetchingNextPage && <Text ta="center" c="dimmed">Loading more...</Text>}
            {!hasNextPage && transactions.length > 0 && (
              <Text ta="center" c="dimmed">No more transactions</Text>
            )}
          </div>
        </Stack>
      )}
    </Stack>
  );
}

export default AccountTransactions;

