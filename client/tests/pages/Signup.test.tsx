import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Signup from '@/pages/Signup'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as authMutations from '@/features/auth/mutations'

vi.mock('@/features/auth/mutations', () => ({
  useSignup: vi.fn(),
}))

describe('Signup page', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  it('renders signup form', () => {
    const mockUseSignup = {
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
    }
    vi.mocked(authMutations.useSignup).mockReturnValue(mockUseSignup as any)

    render(
      <MantineProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Signup />
          </MemoryRouter>
        </QueryClientProvider>
      </MantineProvider>,
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('submits signup and navigates to home on success', async () => {
    let onSuccessCallback: (() => void) | undefined

    const mockMutate = vi.fn((payload, options) => {
      onSuccessCallback = options?.onSuccess
    })

    const mockUseSignup = {
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    }

    vi.mocked(authMutations.useSignup).mockReturnValue(mockUseSignup as any)

    render(
      <MantineProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/signup']}>
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<div>home page</div>} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      </MantineProvider>,
    )

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^first name/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/^last name/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        },
        expect.any(Object),
      )
    })

    if (onSuccessCallback) {
      onSuccessCallback()
    }

    await waitFor(() => {
      expect(screen.getByText('home page')).toBeInTheDocument()
    })
  })

  it('displays error message on signup failure', async () => {
    const mockUseSignup = {
      mutate: vi.fn(),
      isPending: false,
      isError: true,
      error: {
        message: 'Username or email already taken',
      },
    }

    vi.mocked(authMutations.useSignup).mockReturnValue(mockUseSignup as any)

    render(
      <MantineProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Signup />
          </MemoryRouter>
        </QueryClientProvider>
      </MantineProvider>,
    )

    expect(screen.getByText('Username or email already taken')).toBeInTheDocument()
  })

  it('disables submit button when required fields are empty', () => {
    const mockUseSignup = {
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
    }

    vi.mocked(authMutations.useSignup).mockReturnValue(mockUseSignup as any)

    render(
      <MantineProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Signup />
          </MemoryRouter>
        </QueryClientProvider>
      </MantineProvider>,
    )

    const submitButton = screen.getByRole('button', { name: /sign up/i })
    expect(submitButton).toBeDisabled()

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    expect(submitButton).toBeDisabled()

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    })
    expect(submitButton).toBeDisabled()

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    expect(submitButton).not.toBeDisabled()
  })
})

