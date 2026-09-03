import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';

export async function POST() {
  const response = await apiFetch('/auth/refresh', { method: 'POST' });
  const result = NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
  for (const cookie of response.headers.getSetCookie()) {
    const [nameValue, ...parts] = cookie.split(';');
    const [name, ...value] = nameValue.split('=');
    if (name && value.length) result.cookies.set(name.trim(), value.join('=').trim(), { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  }
  return result;
}
