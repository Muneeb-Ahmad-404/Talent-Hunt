import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;
  if (!refreshToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const backendResponse = await fetch(`${process.env.API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await backendResponse.json();
  if (!backendResponse.ok) return NextResponse.json(data, { status: backendResponse.status });

  const response = NextResponse.json({ ok: true });
  response.cookies.set('access_token', data.accessToken, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: 60 * 15,
  });
  response.cookies.set('refresh_token', data.refreshToken, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
