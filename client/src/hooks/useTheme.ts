import { useMantineTheme } from '@mantine/core';

export function useAppTheme() {
  const theme = useMantineTheme();
  
  return {
    ...theme,
    colors: {
      ...theme.colors,
      income: theme.colors.green[5],
      expense: theme.colors.red[5],
      positiveBalance: theme.colors.green[5],
      negativeBalance: theme.colors.red[5],
      icon: theme.colors.gray[6],
    },
    other: {
      background: '#fafbfc',
      cardBackground: '#ffffff',
      incomeBackground: theme.colors.green[0],
      expenseBackground: theme.colors.red[0],
      incomeBorder: theme.colors.green[5],
      expenseBorder: theme.colors.red[5],
    },
  };
}

