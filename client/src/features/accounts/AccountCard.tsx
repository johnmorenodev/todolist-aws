import { Button, Card, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import AddTransaction from "./AddTransaction";
import { AccountSummary } from "@/api/accounts";

interface AccountCardProps {
  data: AccountSummary[];
}

function AccountCard({ data }: AccountCardProps) {
  const [opened, { open, close }] = useDisclosure(false);

  async function onSave(data: any) {
    console.log("data", data);
  }
  return (
    <>
      {data.map((account) => {
        return (
          <>
            <Card withBorder radius="md">
              <Group justify="space-between" className="mb-4">
                <Text>{account.name}</Text>
                <Button onClick={open}>Add</Button>
              </Group>
              <Group justify="space-between" gap={"sm"}>
                <Card withBorder radius="md">
                  Credit ({account.expense})
                </Card>
                <Card withBorder radius="md">
                  Debit ({account.income})
                </Card>
                <Card withBorder radius="md">
                  Balance ({account.balance})
                </Card>
              </Group>
            </Card>
            <Modal opened={opened} onClose={close} title="Authentication">
              <AddTransaction handleSave={onSave} />
            </Modal>
          </>
        );
      })}
    </>
  );
}

export default AccountCard;
