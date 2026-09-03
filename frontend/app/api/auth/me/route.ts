import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';

export async function GET() {
  const response = await apiFetch('/auth/me');
  const body = await response.text();
  return new NextResponse(body, { status: response.status, headers: { 'Content-Type': response.headers.get('content-type') ?? 'application/json' } });
}
