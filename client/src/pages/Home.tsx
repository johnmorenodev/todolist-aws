import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { useAuthStore } from '@/stores/auth'
import { useLogout } from '@/features/auth/mutations'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { username } = useAuthStore()
  const logoutMutation = useLogout()
  const navigate = useNavigate()

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/login', { replace: true })
      },
    })
  }

  return (
    <Stack gap="sm">
      <Title order={2}>Welcome{username ? `, ${username}` : ''}!</Title>
      <Text>You are authenticated.</Text>
      <Group>
        <Button color="red" onClick={handleLogout} loading={logoutMutation.isPending}>
          Logout
        </Button>
      </Group>
    </Stack>
  )
}


