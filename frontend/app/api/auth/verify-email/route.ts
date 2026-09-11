import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const response = await fetch(
      `${process.env.API_URL}/api/auth/verify-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
        cache: 'no-store',
      },
    );

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          message: 'Unable to reach the authentication service.',
        },
      },
      { status: 502 },
    );
  }
}