
export const accountQueryKeys = {
    all: ['accounts'] as const,
    list: () => [...accountQueryKeys.all, 'list'] as const,
    detail: (id: number) => [...accountQueryKeys.all, 'detail', id] as const,
} as const;

export const transactionQueryKeys = {
    all: ['transactions'] as const,
    byAccount: (accountId: number) => [...transactionQueryKeys.all, 'account', accountId] as const,
} as const;