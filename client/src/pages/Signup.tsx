import { useState } from 'react'
import { Button, Group, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { signup } from '@/api/auth'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await signup({ email, username, password, firstName, lastName })
      navigate('/login', { replace: true })
    } catch (e: any) {
      setError('Signup failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack p="lg" align="center">
      <Paper w={520} p="lg" withBorder shadow="sm" radius="md" component="form" onSubmit={onSubmit}>
        <Stack>
          <Title order={3}>Create account</Title>
          {error && <Text c="red">{error}</Text>}
          <TextInput label="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
          <Group grow>
            <TextInput label="First name" value={firstName} onChange={(e) => setFirstName(e.currentTarget.value)} />
            <TextInput label="Last name" value={lastName} onChange={(e) => setLastName(e.currentTarget.value)} />
          </Group>
          <TextInput label="Username" value={username} onChange={(e) => setUsername(e.currentTarget.value)} required />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          <Button type="submit" loading={submitting} disabled={!email || !username || !password}>
            Sign up
          </Button>
          <Text size="sm">
            Already have an account? <Link to="/login">Login</Link>
          </Text>
        </Stack>
      </Paper>
    </Stack>
  )
}


