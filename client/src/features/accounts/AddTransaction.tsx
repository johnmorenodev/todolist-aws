import { NumberInput, Radio, Group, Button } from "@mantine/core";
import React, { useState } from "react";

interface Props {
  handleSave: (data: any) => {};
}

function AddTransaction({ handleSave }: Props) {
  const [amount, setAmount] = useState<number | string>("");
  const [transactionType, setTransactionType] = useState<string | null>("");

  const data = {
    amount,
    transactionType,
  };

  return (
    <div>
      <NumberInput label="Input Amount" value={amount} onChange={setAmount} />
      <Radio.Group
        value={transactionType}
        onChange={setTransactionType}
        name="transactionType"
        label="Select your transaction type"
      >
        <Group>
          <Radio value="income" label="Income" />
          <Radio value="expense" label="Expense" />
        </Group>
      </Radio.Group>

      <Button onClick={() => handleSave(data)}>Save</Button>
    </div>
  );
}

export default AddTransaction;
