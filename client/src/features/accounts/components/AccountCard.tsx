import { Card, Text, Stack, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import React from "react";
import { AccountSummary } from "@/features/accounts/api";

interface AccountCardProps {
  data: AccountSummary[];
}

function AccountCard({ data }: AccountCardProps) {
  const navigate = useNavigate();

  return (
    <Stack gap="md">
      {data.map((account) => {
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
              <Text size="lg" fw={500}>
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
