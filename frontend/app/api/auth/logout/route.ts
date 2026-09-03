import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';

export async function POST() {
  const refreshToken = (await cookies()).get('refresh_token')?.value;
  const response = await apiFetch('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  const result = NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
  result.cookies.delete('access_token');
  result.cookies.delete('refresh_token');
  return result;
}
