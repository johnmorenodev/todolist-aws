import { PropsWithChildren, useEffect, useMemo } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { useAuthMe } from '@/hooks/auth/queries'

export function RequireAuth({ children }: PropsWithChildren) {
  const location = useLocation()
  const { data: authData, isLoading, isError } = useAuthMe()
  const { setAuthData, clearAuth } = useAuthStore()

  useEffect(() => {
    if (authData) {
      setAuthData(authData)
    } else if (isError) {
      clearAuth()
    }
  }, [authData, isError, setAuthData, clearAuth])

  const redirectPath = useMemo(() => {
    const path = location.pathname + location.search
    return path || '/accounts'
  }, [location.pathname, location.search])

  if (isLoading) return null
  
  if (!authData?.authenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />
  }
  
  return children as JSX.Element
}


