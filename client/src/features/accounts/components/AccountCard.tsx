import { Card, Text, Stack, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import React from "react";
import { AccountListItem } from "@/features/accounts/api";

interface AccountCardProps {
  data: AccountListItem[];
}

function AccountCard({ data }: AccountCardProps) {
  const navigate = useNavigate();

  return (
    <Stack gap="md">
      {data.map((account) => {
        const isPositive = account.balance >= 0;
        const balanceColor = isPositive ? "#51cf66" : "#ff6b6b";
        
        return (
          <Card
            key={account.accountId}
            withBorder
            radius="md"
            p="lg"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/accounts/${account.accountId}`)}
          >
            <Group justify="space-between">
              <Text size="lg" fw={600}>
                {account.name}
              </Text>
              <Text size="lg" fw={500} c={balanceColor}>
                {account.balance.toLocaleString()}
              </Text>
            </Group>
          </Card>
        );
      })}
    </Stack>
  );
}

export default AccountCard;
