import { NumberInput, Radio, Group, Button, Stack, Card, TextInput, useMantineTheme } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import React from "react";

const createTransactionSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  transactionType: z.enum(["income", "expense"], {
    required_error: "Please select a transaction type",
  }),
  description: z.string().optional(),
  transactionDate: z.date({
    required_error: "Transaction date is required",
  }),
});

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

interface Props {
  accountId: number;
  onSuccess: (values: CreateTransactionFormData) => void;
}

function AddTransaction({ accountId, onSuccess }: Props) {
  const theme = useMantineTheme();
  const form = useForm<CreateTransactionFormData>({
    initialValues: {
      amount: 0,
      transactionType: undefined,
      description: "",
      transactionDate: new Date(),
    },
    validate: zod4Resolver(createTransactionSchema),
  });

  function handleSubmit(values: CreateTransactionFormData) {
    onSuccess(values);
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
      <Stack gap="lg">
        <NumberInput
          label="Amount"
          placeholder="Enter amount"
          {...form.getInputProps("amount")}
          min={0}
          decimalScale={2}
          thousandSeparator=","
          size="md"
        />
        <Radio.Group
          {...form.getInputProps("transactionType")}
          name="transactionType"
          label="Transaction Type"
          size="md"
          error={form.errors.transactionType}
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
              onClick={() => form.setFieldValue("transactionType", "income")}
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
              onClick={() => form.setFieldValue("transactionType", "expense")}
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
        />
        <DateInput
          label="Transaction Date"
          placeholder="Select date"
          valueFormat="DD MMM YYYY"
          {...form.getInputProps("transactionDate")}
          size="md"
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit" size="md">
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default AddTransaction;

