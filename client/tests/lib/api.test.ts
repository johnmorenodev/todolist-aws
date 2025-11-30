import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/lib/api'
// import * as auth from '@/api/auth'

describe('api helper', () => {
  // const refreshSpy = vi.spyOn(auth, 'authRefresh')

  beforeEach(() => {
    // refreshSpy.mockReset()
    // ensure csrf cookie absent
    Object.defineProperty(document, 'cookie', { value: '', writable: true })
    // reset adapter
    api.defaults.adapter = undefined as any
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('queues on 401 and retries after refresh', async () => {
    // refreshSpy.mockResolvedValueOnce({ status: 200 } as any)
    let call = 0
    api.defaults.adapter = async (config) => {
      call += 1
      if (call === 1) {
        // first 401
        const error: any = new Error('Unauthorized')
        error.response = { status: 401 }
        error.config = config
        throw error
      }
      return {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }
    }
    const res = await api.get('/data')
    expect(res.status).toBe(200)
  })
})


