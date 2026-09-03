import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';

export async function POST() {
  const response = await apiFetch('/auth/logout', { method: 'POST' });
  const result = NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
  result.cookies.delete('access_token');
  result.cookies.delete('refresh_token');
  return result;
}
