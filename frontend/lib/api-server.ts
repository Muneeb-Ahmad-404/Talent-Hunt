import { cookies } from 'next/headers'

const API_URL = process.env.API_URL

export async function apiFetch(path: string, options: RequestInit = {}) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const target = `${API_URL}${normalized.startsWith('/api/') ? normalized : `/api${normalized}`}`
  const token = (await cookies()).get('access_token')?.value
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(target, { ...options, headers, cache: 'no-store' })
}
