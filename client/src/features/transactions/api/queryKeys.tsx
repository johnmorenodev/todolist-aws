export const transactionQueryKeys = {
    all: ['transactions'] as const,
    recent: (accountId: number, transactionType?: string | null) => [...transactionQueryKeys.all, 'account', accountId, 'recent', transactionType || 'all'] as const,
    list: (accountId: number) => [...transactionQueryKeys.all, 'account', accountId, 'list'] as const,
    byAccount: (accountId: number) => [...transactionQueryKeys.all, 'account', accountId] as const,
} as const;

