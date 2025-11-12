import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { useAuthStore } from '@/stores/auth'

export default function Home() {
  const { username, logout } = useAuthStore()

  return (
    <Stack p="lg" gap="md">
      <Title order={2}>Welcome{username ? `, ${username}` : ''}!</Title>
      <Text>You are authenticated.</Text>
      <Group>
        <Button color="red" onClick={() => logout()}>
          Logout
        </Button>
      </Group>
    </Stack>
  )
}


