import { useEffect, useState } from 'react'
import { Button, Paper, PasswordInput, Stack, Text, TextInput, Title, useMantineTheme } from '@mantine/core'
import { useAuthStore } from '@/stores/auth'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useLogin } from '@/features/auth/mutations'
import { useAuthMe } from '@/features/auth/queries'
import { IconLock, IconUser } from '@tabler/icons-react'

export default function Login() {
  const theme = useMantineTheme()
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
    <Stack align="center" gap="xl" style={{ paddingTop: '4rem' }}>
      <Paper 
        w="100%" 
        maw={420} 
        p="xl" 
        withBorder 
        shadow="md"
        radius="lg" 
        component="form" 
        onSubmit={onSubmit}
        style={{
          background: theme.other?.cardBackground || '#ffffff',
        }}
      >
        <Stack gap="sm">
          <div style={{ textAlign: 'center' }}>
            <Title order={2} fw={700}>Welcome Back</Title>
            <Text c="dimmed" size="sm" mt="xs">Sign in to continue</Text>
          </div>
          {loginMutation.isError && (
            <Text c="red" size="sm" style={{ textAlign: 'center' }}>
              {(loginMutation.error as any)?.message || 'Invalid credentials'}
            </Text>
          )}
          <TextInput
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            leftSection={<IconUser size={18} />}
            required
            size="md"
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            leftSection={<IconLock size={18} />}
            required
            size="md"
          />
          <Button 
            type="submit" 
            loading={loginMutation.isPending} 
            disabled={!username || !password}
            size="md"
            fullWidth
            style={{
              background: `linear-gradient(135deg, ${theme.colors.blue[5]} 0%, ${theme.colors.blue[6]} 100%)`,
              transition: 'all 0.2s ease',
            }}
          >
            Sign in
          </Button>
          <Text size="sm" style={{ textAlign: 'center' }}>
            No account? <Link to="/signup" style={{ color: theme.colors.blue[5], fontWeight: 600 }}>Create one</Link>
          </Text>
        </Stack>
      </Paper>
    </Stack>
  )
}


