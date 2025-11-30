import { useParams, useNavigate } from "react-router-dom";
import { useAccountSummary } from "@/features/accounts/api/queries";
import { useAccountTransactionsInfinite } from "@/features/transactions/api/queries";
import { Text, ActionIcon, Stack, Group, TextInput, Select, Title, Divider, useMantineTheme, Modal, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useEffect, useRef, useState, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { IconX, IconArrowLeft, IconSearch } from "@tabler/icons-react";
import TransactionCard from "@/features/transactions/components/TransactionCard";
import AddTransaction, { CreateTransactionFormData } from "@/features/transactions/components/AddTransaction";
import { useUpdateTransaction, useDeleteTransaction } from "@/features/transactions/api/mutations";
import { TransactionFilter, Transaction } from "@/features/transactions/api/queries";

function AccountTransactions() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const accountIdNum = accountId ? Number(accountId) : 0;
  const { data: accountSummary, isLoading: isLoadingAccount } = useAccountSummary(accountIdNum);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

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

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    
    transactions.forEach((transaction) => {
      const dateStr = transaction.transactionDate || transaction.createdAt;
      if (!dateStr) return;
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return;
      
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(transaction);
    });
    
    // Sort transactions within each group by date (newest first)
    Object.keys(groups).forEach((key) => {
      const group = groups[key];
      if (group) {
        group.sort((a, b) => {
          const dateA = new Date(a.transactionDate || a.createdAt).getTime();
          const dateB = new Date(b.transactionDate || b.createdAt).getTime();
          return dateB - dateA;
        });
      }
    });
    
    // Sort groups by date (newest first)
    return Object.entries(groups).sort(([keyA], [keyB]) => {
      const partsA = keyA.split('-').map(Number);
      const partsB = keyB.split('-').map(Number);
      const yearA = partsA[0] ?? 0;
      const monthA = partsA[1] ?? 0;
      const yearB = partsB[0] ?? 0;
      const monthB = partsB[1] ?? 0;
      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    });
  }, [transactions]);

  const formatMonthLabel = (year: number, month: number): string => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[month]} ${year}`;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
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

  function handleEdit(transaction: Transaction) {
    setSelectedTransaction(transaction);
    openEditModal();
  }

  function handleDelete(transaction: Transaction) {
    setSelectedTransaction(transaction);
    openDeleteModal();
  }

  function confirmDelete() {
    if (!selectedTransaction) return;

    deleteTransactionMutation.mutate(
      { id: selectedTransaction.id, accountId: accountIdNum },
      {
        onSuccess: () => {
          closeDeleteModal();
          setSelectedTransaction(null);
        },
      }
    );
  }

  function handleUpdateTransaction(values: CreateTransactionFormData) {
    if (!selectedTransaction) return;

    const transactionDate = new Date(values.transactionDate);
    transactionDate.setHours(0, 0, 0, 0);

    updateTransactionMutation.mutate(
      {
        id: selectedTransaction.id,
        accountId: accountIdNum,
        payload: {
          amount: values.amount,
          transactionType: values.transactionType,
          description: values.description || undefined,
          transactionDate: transactionDate.toISOString(),
        },
      },
      {
        onSuccess: () => {
          closeEditModal();
          setSelectedTransaction(null);
        },
      }
    );
  }

  function handleCloseEditModal() {
    if (updateTransactionMutation.isPending) return;
    closeEditModal();
    setSelectedTransaction(null);
  }

  function handleCloseDeleteModal() {
    if (deleteTransactionMutation.isPending) return;
    closeDeleteModal();
    setSelectedTransaction(null);
  }

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
    <Stack gap="sm">
      <Group gap="sm" align="center" wrap="nowrap">
        <ActionIcon 
          variant="subtle" 
          onClick={() => navigate(`/accounts/${accountId}`)} 
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
      <Stack gap="sm">
        <Group gap="sm" align="flex-end">
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
          <Group gap="sm" grow>
            <DateInput
              label="Start Date"
              placeholder="Select start date"
              value={customStartDate}
              onChange={(value) => setCustomStartDate(value as Date | null)}
              size="md"
              style={{ background: 'white' }}
            />
            <DateInput
              label="End Date"
              placeholder="Select end date"
              value={customEndDate}
              onChange={(value) => setCustomEndDate(value as Date | null)}
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
          {groupedTransactions.map(([key, monthTransactions]) => {
            const parts = key.split('-').map(Number);
            const year = parts[0] ?? new Date().getFullYear();
            const month = parts[1] ?? new Date().getMonth();
            return (
              <Stack key={key} gap="sm">
                <Group gap="xs" align="center" mt="xs">
                  <Text 
                    size="md" 
                    fw={600} 
                    c="dimmed"
                    style={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.875rem',
                    }}
                  >
                    {formatMonthLabel(year, month)}
                  </Text>
                  <Divider 
                    style={{ flex: 1 }} 
                    color={theme.colors.gray[3]}
                  />
                </Group>
                <Stack gap="sm">
                  {monthTransactions.map((transaction) => (
                    <TransactionCard 
                      key={transaction.id} 
                      transaction={transaction}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </Stack>
              </Stack>
            );
          })}
          <div ref={loadMoreRef}>
            {isFetchingNextPage && <Text ta="center" c="dimmed">Loading more...</Text>}
            {!hasNextPage && transactions.length > 0 && (
              <Text ta="center" c="dimmed">No more transactions</Text>
            )}
          </div>
        </Stack>
      )}
      <Modal
        opened={editModalOpened}
        onClose={handleCloseEditModal}
        title="Edit Transaction"
        size="md"
        radius="md"
        closeOnClickOutside={!updateTransactionMutation.isPending}
        closeOnEscape={!updateTransactionMutation.isPending}
        withCloseButton={!updateTransactionMutation.isPending}
      >
        <AddTransaction
          key={selectedTransaction?.id || "new"}
          accountId={accountIdNum}
          onSuccess={handleUpdateTransaction}
          initialData={selectedTransaction || undefined}
          isLoading={updateTransactionMutation.isPending}
        />
      </Modal>
      <Modal
        opened={deleteModalOpened}
        onClose={handleCloseDeleteModal}
        title="Delete Transaction"
        size="md"
        radius="md"
        closeOnClickOutside={!deleteTransactionMutation.isPending}
        closeOnEscape={!deleteTransactionMutation.isPending}
        withCloseButton={!deleteTransactionMutation.isPending}
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button 
              variant="subtle" 
              onClick={handleCloseDeleteModal}
              disabled={deleteTransactionMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              color="red" 
              onClick={confirmDelete} 
              loading={deleteTransactionMutation.isPending}
              disabled={deleteTransactionMutation.isPending}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

export default AccountTransactions;

