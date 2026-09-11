import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const response = await fetch(`${process.env.API_URL}/api/auth/me`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    cache: 'no-store',
  });

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('content-type') ?? 'application/json' },
  });
}
