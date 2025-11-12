import { useEffect, useState } from 'react'
import { Button, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { useAuthStore } from '@/stores/auth'
import { useLocation, useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login, initializing, bootstrap } = useAuthStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initializing) {
      void bootstrap()
    }
  }, [initializing, bootstrap])

  const redirect = new URLSearchParams(location.search).get('redirect') || '/'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect, { replace: true })
    }
  }, [isAuthenticated, navigate, redirect])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(username, password)
      navigate(redirect, { replace: true })
    } catch (e: any) {
      setError('Invalid credentials')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack p="lg" align="center">
      <Paper w={420} p="lg" withBorder shadow="sm" radius="md" component="form" onSubmit={onSubmit}>
        <Stack>
          <Title order={3}>Login</Title>
          {error && <Text c="red">{error}</Text>}
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
          <Button type="submit" loading={submitting} disabled={!username || !password}>
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


