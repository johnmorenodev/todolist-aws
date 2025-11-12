import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Login from '@/pages/Login'
import { useAuthStore } from '@/stores/auth'
import { MantineProvider } from '@mantine/core'

describe('Login page', () => {
  it('submits and navigates on success', async () => {
    const loginSpy = vi.spyOn(useAuthStore.getState(), 'login').mockResolvedValueOnce()
    render(
      <MantineProvider>
        <MemoryRouter initialEntries={['/login?redirect=%2F']}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<div>home</div>} />
          </Routes>
        </MemoryRouter>
      </MantineProvider>,
    )
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'u' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'p' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText('home')).toBeInTheDocument())
    expect(loginSpy).toHaveBeenCalledWith('u', 'p')
  })
})


