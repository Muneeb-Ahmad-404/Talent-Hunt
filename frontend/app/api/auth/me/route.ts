import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  let backendResponse = await fetch(`${process.env.API_URL}/api/auth/me`, {
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {},
    cache: 'no-store',
  });

  if (backendResponse.status !== 401 || !refreshToken) {
    return new NextResponse(await backendResponse.text(), {
      status: backendResponse.status,
      headers: {
        'Content-Type':
          backendResponse.headers.get('content-type') ?? 'application/json',
      },
    });
  }

  const refreshResponse = await fetch(
    `${process.env.API_URL}/api/auth/refresh`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    },
  );

  if (!refreshResponse.ok) {
    const response = new NextResponse(
      await refreshResponse.text(),
      {
        status: refreshResponse.status,
        headers: {
          'Content-Type':
            refreshResponse.headers.get('content-type') ?? 'application/json',
        },
      },
    );

    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');

    return response;
  }

  const tokens = await refreshResponse.json();
  accessToken = tokens.accessToken;

  backendResponse = await fetch(`${process.env.API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  const response = new NextResponse(await backendResponse.text(), {
    status: backendResponse.status,
    headers: {
      'Content-Type':
        backendResponse.headers.get('content-type') ?? 'application/json',
    },
  });

  response.cookies.set('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  });

  response.cookies.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}