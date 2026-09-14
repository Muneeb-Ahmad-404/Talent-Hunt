import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  const backendResponse = await fetch(
    `${process.env.API_URL}/api/auth/accept-invitation`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    },
  )

  const data = await backendResponse.json().catch(() => ({}))

  if (!backendResponse.ok) {
    return NextResponse.json(data, {
      status: backendResponse.status,
    })
  }

  const response = NextResponse.json(data, {
    status: backendResponse.status,
  })

  if (data.accessToken) {
    response.cookies.set('access_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    })
  }

  if (data.refreshToken) {
    response.cookies.set('refresh_token', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  }

  return response
}