import { api } from '@/lib/api'

export type MeResponse = { authenticated: boolean; username?: string }

export async function signup(payload: { email: string; username: string; password: string; firstName: string; lastName: string }) {
  return api.post('/auth/signup', payload)
}

export async function authMe() {
  return api.get<MeResponse>('/auth/me')
}

export async function authRefresh() {
  return api.post('/auth/refresh')
}

export async function authLogin(payload: { username: string; password: string }) {
  return api.post('/auth/login', payload)
}

export async function authLogout() {
  return api.post('/auth/logout')
}




