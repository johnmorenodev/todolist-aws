export const accountQueryKeys = {
    all: ['accounts'] as const,
    list: () => [...accountQueryKeys.all, 'list'] as const,
    detail: (id: number) => [...accountQueryKeys.all, 'detail', id] as const,
    summary: (id: number) => [...accountQueryKeys.all, 'summary', id] as const,
} as const;