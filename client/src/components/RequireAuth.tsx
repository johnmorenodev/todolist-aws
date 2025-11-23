import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { useAuthMe } from '@/features/auth/queries'
import { useRefresh } from '@/features/auth/mutations'

export function RequireAuth({ children }: PropsWithChildren) {
  const location = useLocation()
  const { data: authData, isLoading, isError, refetch } = useAuthMe()
  const { setAuthData, clearAuth } = useAuthStore()
  const refreshMutation = useRefresh()
  const [hasTriedRefresh, setHasTriedRefresh] = useState(false)

  useEffect(() => {
    if (authData) {
      setAuthData(authData)
      setHasTriedRefresh(false) // Reset refresh attempt flag on successful auth
    } else if (isError) {
      // Only clear auth if we've already tried refreshing
      if (hasTriedRefresh) {
        clearAuth()
      }
    }
  }, [authData, isError, setAuthData, clearAuth, hasTriedRefresh])

  // Try to refresh token if authenticated is false but we haven't tried yet
  useEffect(() => {
    if (
      !isLoading && 
      authData && 
      !authData.authenticated && 
      !hasTriedRefresh && 
      !refreshMutation.isPending &&
      !refreshMutation.isSuccess
    ) {
      setHasTriedRefresh(true)
      refreshMutation.mutate(undefined, {
        onSuccess: () => {
          // Refetch auth status after successful refresh
          setTimeout(() => {
            refetch()
          }, 100) // Small delay to ensure cookies are set
        },
        onError: () => {
          // Refresh failed, will be handled by error effect
          setHasTriedRefresh(true) // Mark as tried even on error
        },
      })
    }
  }, [authData, isLoading, hasTriedRefresh, refreshMutation, refetch])

  const redirectPath = useMemo(() => {
    const path = location.pathname + location.search
    return path || '/accounts'
  }, [location.pathname, location.search])

  if (isLoading || refreshMutation.isPending) return null
  
  // If we're trying to refresh, wait a bit
  if (!authData?.authenticated && !hasTriedRefresh) {
    return null
  }
  
  if (!authData?.authenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />
  }
  
  return children as JSX.Element
}


