import { NumberInput, Radio, Group, Button, Stack, Card, TextInput, useMantineTheme } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import React, { useEffect, useRef } from "react";
import { Transaction } from "../api/queries";

const createTransactionSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  transactionType: z.enum(["income", "expense"], {
    message: "Please select a transaction type",
  }),
  description: z.string().optional(),
  transactionDate: z.date({
    message: "Transaction date is required",
  }),
});

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

interface Props {
  accountId: number;
  onSuccess: (values: CreateTransactionFormData) => void;
  initialData?: Transaction | null;
  isLoading?: boolean;
}

function AddTransaction({ accountId, onSuccess, initialData, isLoading = false }: Props) {
  const theme = useMantineTheme();
  const isEditMode = !!initialData;
  const amountInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<CreateTransactionFormData>({
    initialValues: {
      amount: initialData?.amount || 0,
      transactionType: (initialData?.transactionType as "income" | "expense") || "income",
      description: initialData?.description || "",
      transactionDate: initialData?.transactionDate 
        ? new Date(initialData.transactionDate) 
        : initialData?.createdAt 
        ? new Date(initialData.createdAt)
        : new Date(),
    },
    validate: zod4Resolver(createTransactionSchema),
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        amount: initialData.amount,
        transactionType: initialData.transactionType as "income" | "expense",
        description: initialData.description || "",
        transactionDate: initialData.transactionDate 
          ? new Date(initialData.transactionDate) 
          : initialData.createdAt 
          ? new Date(initialData.createdAt)
          : new Date(),
      });
    }
  }, [initialData]);

  function handleSubmit(values: CreateTransactionFormData) {
    onSuccess(values);
  }

  const amountInputProps = form.getInputProps("amount");
  const originalOnFocus = amountInputProps.onFocus;

  function handleAmountFocus(event: React.FocusEvent<HTMLInputElement>) {
    if (originalOnFocus) {
      originalOnFocus(event);
    }
    setTimeout(() => {
      const input = amountInputRef.current || event.target as HTMLInputElement;
      if (input && input.select) {
        input.select();
      }
    }, 0);
  }

  const isIncomeSelected = form.values.transactionType === "income";
  const isExpenseSelected = form.values.transactionType === "expense";
  const incomeColor = theme.colors.green[5];
  const expenseColor = theme.colors.red[5];
  const incomeBg = theme.colors.green[0];
  const expenseBg = theme.colors.red[0];
  const defaultBorder = theme.colors.gray[3];

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <NumberInput
          label="Amount"
          placeholder="Enter amount"
          {...amountInputProps}
          min={0}
          decimalScale={2}
          thousandSeparator=","
          size="md"
          disabled={isLoading}
          onFocus={handleAmountFocus}
          getInputRef={(input) => {
            amountInputRef.current = input;
            if (typeof amountInputProps.getInputRef === 'function') {
              amountInputProps.getInputRef(input);
            }
          }}
        />
        <Radio.Group
          {...form.getInputProps("transactionType")}
          name="transactionType"
          label="Transaction Type"
          size="md"
          error={form.errors.transactionType}
          disabled={isLoading}
        >
          <Group mt="xs" gap="sm">
            <Card
              withBorder
              radius="md"
              p="xs"
              style={{
                borderColor: isIncomeSelected ? incomeColor : defaultBorder,
                backgroundColor: isIncomeSelected ? incomeBg : "transparent",
                cursor: "pointer",
              }}
              onClick={() => !isLoading && form.setFieldValue("transactionType", "income")}
            >
              <Radio
                value="income"
                label="Income"
                color="green"
                styles={{
                  label: {
                    color: isIncomeSelected ? incomeColor : undefined,
                    fontWeight: isIncomeSelected ? 600 : undefined,
                  },
                }}
              />
            </Card>
            <Card
              withBorder
              radius="md"
              p="xs"
              style={{
                borderColor: isExpenseSelected ? expenseColor : defaultBorder,
                backgroundColor: isExpenseSelected ? expenseBg : "transparent",
                cursor: "pointer",
              }}
              onClick={() => !isLoading && form.setFieldValue("transactionType", "expense")}
            >
              <Radio
                value="expense"
                label="Expense"
                color="red"
                styles={{
                  label: {
                    color: isExpenseSelected ? expenseColor : undefined,
                    fontWeight: isExpenseSelected ? 600 : undefined,
                  },
                }}
              />
            </Card>
          </Group>
        </Radio.Group>
        <TextInput
          label="Description"
          placeholder="Optional description"
          {...form.getInputProps("description")}
          size="md"
          disabled={isLoading}
        />
        <DateInput
          label="Transaction Date"
          placeholder="Select date"
          valueFormat="DD MMM YYYY"
          {...form.getInputProps("transactionDate")}
          size="md"
          disabled={isLoading}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit" size="md" loading={isLoading} disabled={isLoading}>
            {isEditMode ? "Update" : "Save"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default AddTransaction;

