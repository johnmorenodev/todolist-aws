import { useState } from 'react'
import { Button, Group, Paper, PasswordInput, Stack, Text, TextInput, Title, useMantineTheme } from '@mantine/core'
import { Link, useNavigate } from 'react-router-dom'
import { useSignup } from '@/features/auth/api/mutations'
import { IconMail, IconUser, IconLock, IconUserCircle } from '@tabler/icons-react'

export default function Signup() {
  const theme = useMantineTheme()
  const navigate = useNavigate()
  const signupMutation = useSignup()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    signupMutation.mutate(
      { email, username, password, firstName, lastName },
      {
        onSuccess: () => {
          navigate('/login', { replace: true })
        },
      }
    )
  }

  const error = signupMutation.isError
    ? (() => {
        const err = signupMutation.error as any
        const fieldErrors = err?.fieldErrors
        if (fieldErrors) {
          return Object.entries(fieldErrors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(', ')
        }
        return err?.message || 'Signup failed'
      })()
    : null

  return (
    <Stack align="center" gap="xl" style={{ paddingTop: '2rem' }}>
      <Paper 
        w="100%" 
        maw={520} 
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
        <Stack gap="lg">
          <div style={{ textAlign: 'center' }}>
            <Title order={2} fw={700}>Create Account</Title>
            <Text c="dimmed" size="sm" mt="xs">Join us and start managing your finances</Text>
          </div>
          {error && <Text c="red" size="sm" style={{ textAlign: 'center' }}>{error}</Text>}
          <TextInput 
            label="Email" 
            placeholder="Enter your email"
            value={email} 
            onChange={(e) => setEmail(e.currentTarget.value)} 
            leftSection={<IconMail size={18} />}
            required 
            size="md"
          />
          <Group grow>
            <TextInput 
              label="First name" 
              placeholder="First name"
              value={firstName} 
              onChange={(e) => setFirstName(e.currentTarget.value)} 
              size="md"
            />
            <TextInput 
              label="Last name" 
              placeholder="Last name"
              value={lastName} 
              onChange={(e) => setLastName(e.currentTarget.value)} 
              size="md"
            />
          </Group>
          <TextInput 
            label="Username" 
            placeholder="Choose a username"
            value={username} 
            onChange={(e) => setUsername(e.currentTarget.value)} 
            leftSection={<IconUserCircle size={18} />}
            required 
            size="md"
          />
          <PasswordInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            leftSection={<IconLock size={18} />}
            required
            size="md"
          />
          <Button 
            type="submit" 
            loading={signupMutation.isPending} 
            disabled={!email || !username || !password}
            size="md"
            fullWidth
            style={{
              background: `linear-gradient(135deg, ${theme.colors.blue[5]} 0%, ${theme.colors.blue[6]} 100%)`,
              transition: 'all 0.2s ease',
            }}
          >
            Sign up
          </Button>
          <Text size="sm" style={{ textAlign: 'center' }}>
            Already have an account? <Link to="/login" style={{ color: theme.colors.blue[5], fontWeight: 600 }}>Login</Link>
          </Text>
        </Stack>
      </Paper>
    </Stack>
  )
}


