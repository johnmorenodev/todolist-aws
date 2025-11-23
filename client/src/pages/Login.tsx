import { useEffect, useState } from 'react'
import { Button, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { useAuthStore } from '@/stores/auth'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useLogin } from '@/hooks/auth/mutations'
import { useAuthMe } from '@/hooks/auth/queries'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()
  const { data: authData } = useAuthMe()
  const loginMutation = useLogin()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const redirect = new URLSearchParams(location.search).get('redirect') || '/accounts'

  useEffect(() => {
    if (isAuthenticated || authData?.authenticated) {
      navigate(redirect, { replace: true })
    }
  }, [isAuthenticated, authData, navigate, redirect])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          navigate(redirect, { replace: true })
        },
      }
    )
  }

  return (
    <Stack align="center">
      <Paper w="100%" maw={420} p="lg" withBorder shadow="sm" radius="md" component="form" onSubmit={onSubmit}>
        <Stack>
          <Title order={3}>Login</Title>
          {loginMutation.isError && (
            <Text c="red">{(loginMutation.error as any)?.message || 'Invalid credentials'}</Text>
          )}
          <TextInput
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            required
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          <Button type="submit" loading={loginMutation.isPending} disabled={!username || !password}>
            Sign in
          </Button>
          <Text size="sm">
            No account? <Link to="/signup">Create one</Link>
          </Text>
        </Stack>
      </Paper>
    </Stack>
  )
}


