import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '@/stores/auth'
import * as api from '@/api/auth'

describe('auth store', () => {
  beforeEach(() => {
    const { setState } = useAuthStore as any
    setState({ isAuthenticated: false, username: null, initializing: true })
  })

  it('bootstrap sets authenticated on success', async () => {
    vi.spyOn(api, 'authMe').mockResolvedValueOnce({ data: { authenticated: true, username: 'alice' } } as any)
    await useAuthStore.getState().bootstrap()
    const s = useAuthStore.getState()
    expect(s.isAuthenticated).toBe(true)
    expect(s.username).toBe('alice')
    expect(s.initializing).toBe(false)
  })

  it('tryRefresh returns boolean', async () => {
    vi.spyOn(api, 'authRefresh').mockResolvedValueOnce({ status: 200 } as any)
    const ok = await useAuthStore.getState().tryRefresh()
    expect(ok).toBe(true)
  })
})


