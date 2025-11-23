export const transactionQueryKeys = {
    all: ['transactions'] as const,
    recent: (accountId: number) => [...transactionQueryKeys.all, 'account', accountId, 'recent'] as const,
    list: (accountId: number) => [...transactionQueryKeys.all, 'account', accountId, 'list'] as const,
    byAccount: (accountId: number) => [...transactionQueryKeys.all, 'account', accountId] as const,
} as const;

