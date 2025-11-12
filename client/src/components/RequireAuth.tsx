import { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

export function RequireAuth({ children }: PropsWithChildren) {
  const location = useLocation()
  const { initializing, isAuthenticated, bootstrap, tryRefresh } = useAuthStore()
  const [attemptedRefresh, setAttemptedRefresh] = useState(false)
  const refreshInFlight = useRef(false)

  useEffect(() => {
    if (initializing) {
      void bootstrap()
    }
  }, [initializing, bootstrap])

  useEffect(() => {
    const run = async () => {
      if (!initializing && !isAuthenticated && !attemptedRefresh && !refreshInFlight.current) {
        refreshInFlight.current = true
        try {
          const refreshed = await tryRefresh()
          if (refreshed) {
            await bootstrap()
          }
        } finally {
          setAttemptedRefresh(true)
          refreshInFlight.current = false
        }
      }
    }
    void run()
  }, [initializing, isAuthenticated, attemptedRefresh, bootstrap, tryRefresh])

  const redirectPath = useMemo(() => {
    const path = location.pathname + location.search
    return path || '/'
  }, [location.pathname, location.search])

  if (initializing) return null
  if (!isAuthenticated) {
    if (!attemptedRefresh) return null
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />
  }
  return children as JSX.Element
}


