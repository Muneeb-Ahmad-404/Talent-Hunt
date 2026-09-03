import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;
  if (!refreshToken) return NextResponse.json({ message: 'No refresh session' }, { status: 401 });
  const response = await apiFetch('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  const result = NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
  for (const cookie of response.headers.getSetCookie()) {
    const [nameValue, ...parts] = cookie.split(';');
    const [name, ...value] = nameValue.split('=');
    if (name && value.length) result.cookies.set(name.trim(), value.join('=').trim(), { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  }
  return result;
}
