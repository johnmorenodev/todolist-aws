import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { RequireAuth } from '@/components/RequireAuth'
import { useAuthStore } from '@/stores/auth'

function setAuth(state: Partial<ReturnType<typeof useAuthStore.getState>>) {
  const { setState } = useAuthStore as any
  setState({ isAuthenticated: false, username: null, initializing: false, ...state })
}

describe('RequireAuth', () => {
  it('renders children when authenticated', async () => {
    setAuth({ isAuthenticated: true })
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <div>secret</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('secret')).toBeTruthy()
  })
})


