import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

async function forward(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  const body = request.method === 'GET' || request.method === 'DELETE' ? undefined : await request.text();
  const response = await fetch(`${process.env.API_URL}/api/${path.join('/')}${request.nextUrl.search}`, {
    method: request.method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': request.headers.get('content-type') ?? 'application/json' } : {}),
    },
    body,
  });
  const text = await response.text();
  return new NextResponse(text, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('content-type') ?? 'application/json' },
  });
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;
