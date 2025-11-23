import { Card, Text, Stack, Group, useMantineTheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import React from "react";
import { AccountListItem } from "@/features/accounts/api/queries";
import { IconWallet } from "@tabler/icons-react";

interface AccountCardProps {
  data: AccountListItem[];
}

function AccountCard({ data }: AccountCardProps) {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  return (
    <Stack gap="md">
      {data.map((account) => {
        const isPositive = account.balance >= 0;
        const balanceColor = isPositive 
          ? (theme.other?.positiveBalance || theme.colors.green[5])
          : (theme.other?.negativeBalance || theme.colors.red[5]);
        
        return (
          <Card
            key={account.accountId}
            withBorder
            radius="md"
            p="lg"
            shadow="sm"
            style={{ 
              cursor: "pointer",
              background: theme.other?.cardBackground || '#ffffff',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.md;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
            onClick={() => navigate(`/accounts/${account.accountId}`)}
          >
            <Group justify="space-between">
              <Group gap="sm">
                <IconWallet size={24} color={theme.colors.gray[6]} />
                <Text size="lg" fw={600}>
                  {account.name}
                </Text>
              </Group>
              <Text size="lg" fw={600} c={balanceColor}>
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
