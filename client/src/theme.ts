import { createTheme, MantineColorsTuple } from '@mantine/core';

const blue: MantineColorsTuple = [
  '#e7f5ff',
  '#d0ebff',
  '#a5d8ff',
  '#74c0fc',
  '#4dabf7',
  '#339af0',
  '#228be6',
  '#1c7ed6',
  '#1971c2',
  '#1864ab',
];

const green: MantineColorsTuple = [
  '#f0f9f4',
  '#d3f9d8',
  '#b2f2bb',
  '#8ce99a',
  '#69db7c',
  '#51cf66',
  '#40c057',
  '#37b24d',
  '#2f9e44',
  '#2b8a3e',
];

const red: MantineColorsTuple = [
  '#fff5f5',
  '#ffe3e3',
  '#ffc9c9',
  '#ffa8a8',
  '#ff8787',
  '#ff6b6b',
  '#fa5252',
  '#f03e3e',
  '#e03131',
  '#c92a2a',
];

const gray: MantineColorsTuple = [
  '#f8f9fa',
  '#f1f3f5',
  '#e9ecef',
  '#dee2e6',
  '#ced4da',
  '#adb5bd',
  '#868e96',
  '#495057',
  '#343a40',
  '#212529',
];

export const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue,
    green,
    red,
    gray,
  },
  defaultRadius: 'md',
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  components: {
    Stack: {
      defaultProps: {
        gap: 'sm',
      },
    },
  },
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },
  other: {
    // Custom design tokens
    background: '#fafbfc',
    cardBackground: '#ffffff',
    incomeColor: '#51cf66',
    expenseColor: '#ff6b6b',
    iconColor: '#868e96',
    positiveBalance: '#51cf66',
    negativeBalance: '#ff6b6b',
  },
});

