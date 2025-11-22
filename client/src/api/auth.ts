import { api } from '@/lib/api'

export type MeData = { authenticated: boolean; username: string | null }

export async function signup(payload: {
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
}) {
  return api.post<void>('/auth/signup', payload)
}

export async function authMe() {
  return api.get<MeData>('/auth/me')
}

export async function authRefresh() {
  return api.post<void>('/auth/refresh')
}

export async function authLogin(payload: { username: string; password: string }) {
  return api.post<void>('/auth/login', payload)
}

export async function authLogout() {
  return api.post<void>('/auth/logout')
}


