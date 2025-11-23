import { useParams, useNavigate } from "react-router-dom";
import { useAccountList } from "@/hooks/accounts/queries";
import { Text, ActionIcon, Card, Stack, Group, TextInput, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getTransactionsByAccount } from "@/features/accounts/api/transactions";
import { transactionQueryKeys } from "@/features/accounts/api/queryKeys";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "@/utils/date";
import { IconX } from "@tabler/icons-react";

function AccountTransactions() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const { data: accounts } = useAccountList();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

  const account = accounts?.find((acc) => acc.accountId === Number(accountId));

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

  const infiniteQuery = useInfiniteQuery({
    queryKey: [
      ...transactionQueryKeys.byAccount(Number(accountId)), 
      "infinite",
      dateFilter,
      transactionTypeFilter,
      customStartDate?.toISOString(),
      customEndDate?.toISOString(),
    ],
    queryFn: async ({ pageParam }) => {
      const result = await getTransactionsByAccount(
        Number(accountId), 
        20, 
        pageParam,
        undefined,
        dateParams.startDate,
        dateParams.endDate,
        transactionTypeFilter
      );
      return Array.isArray(result) ? result : [];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) {
        return undefined;
      }
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: !debouncedSearch.trim() && !hasFilters,
  });

  const filteredQuery = useQuery({
    queryKey: [
      ...transactionQueryKeys.byAccount(Number(accountId)), 
      "filtered",
      debouncedSearch,
      dateFilter,
      transactionTypeFilter,
      customStartDate?.toISOString(),
      customEndDate?.toISOString(),
    ],
    queryFn: async () => {
      const result = await getTransactionsByAccount(
        Number(accountId), 
        1000, 
        0,
        debouncedSearch || undefined,
        dateParams.startDate,
        dateParams.endDate,
        transactionTypeFilter
      );
      return Array.isArray(result) ? result : [];
    },
    enabled: debouncedSearch.trim() !== "" || hasFilters,
  });

  const isLoading = hasFilters ? filteredQuery.isLoading : infiniteQuery.isLoading;
  const isError = hasFilters ? filteredQuery.isError : infiniteQuery.isError;
  const fetchNextPage = infiniteQuery.fetchNextPage;
  const hasNextPage = infiniteQuery.hasNextPage;
  const isFetchingNextPage = infiniteQuery.isFetchingNextPage;

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

  const isIncome = (transactionType: string) => transactionType === "income";

  const transactions = hasFilters
    ? (filteredQuery.data || [])
    : (infiniteQuery.data?.pages.flat() || []);

  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setDateFilter("all");
    setTransactionTypeFilter("all");
    setCustomStartDate(null);
    setCustomEndDate(null);
  };

  if (!account) {
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
      <ActionIcon variant="subtle" onClick={() => navigate(`/accounts/${accountId}`)} className="mb-4" size="lg">
        ←
      </ActionIcon>
      <Text size="xl" fw={600} className="mb-4">
        {account.name} - All Transactions
      </Text>
      <TextInput
        placeholder="Search by description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="md"
        className="mb-4"
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
            style={{ flex: 1 }}
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
            style={{ flex: 1 }}
          />
          {hasFilters && (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={handleClearFilters}
              size="lg"
              title="Clear filters"
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
            />
            <DateInput
              label="End Date"
              placeholder="Select end date"
              value={customEndDate}
              onChange={setCustomEndDate}
              size="md"
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
          {transactions.map((transaction) => {
            const income = isIncome(transaction.transactionType);
            return (
              <Card
                key={transaction.id}
                withBorder
                radius="md"
                p="md"
                style={{
                  borderColor: income ? "#51cf66" : "#ff6b6b",
                  backgroundColor: income ? "#f0f9f4" : "#fff5f5",
                }}
              >
                <Group justify="space-between">
                  <div>
                    <Text size="sm" c="dimmed">
                      {formatDate(transaction.transactionDate || transaction.createdAt)}
                    </Text>
                    <Text fw={500} size="md">
                      {transaction.description || "No description"}
                    </Text>
                  </div>
                  <Text
                    fw={600}
                    size="lg"
                    c={income ? "#51cf66" : "#ff6b6b"}
                  >
                    {income ? "+" : "-"}
                    {transaction.amount.toLocaleString()}
                  </Text>
                </Group>
              </Card>
            );
          })}
          {!hasFilters && (
            <div ref={loadMoreRef}>
              {isFetchingNextPage && <Text ta="center" c="dimmed">Loading more...</Text>}
              {!hasNextPage && transactions.length > 0 && (
                <Text ta="center" c="dimmed">No more transactions</Text>
              )}
            </div>
          )}
        </Stack>
      )}
    </div>
  );
}

export default AccountTransactions;

