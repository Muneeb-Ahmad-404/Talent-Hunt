import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type RefreshResult = {
  accessToken: string;
  refreshToken: string;
};

async function refreshSession(
  refreshToken: string,
): Promise<RefreshResult | null> {
  try {
    const response = await fetch(
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

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as Partial<RefreshResult>;

    if (!data.accessToken || !data.refreshToken) {
      return null;
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch {
    return null;
  }
}

async function sendBackendRequest(
  request: NextRequest,
  path: string[],
  accessToken?: string,
) {
  const body =
    request.method === 'GET' || request.method === 'DELETE'
      ? undefined
      : await request.text();

  return fetch(
    `${process.env.API_URL}/api/${path.join('/')}${request.nextUrl.search}`,
    {
      method: request.method,
      headers: {
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
        ...(body
          ? {
              'Content-Type':
                request.headers.get('content-type') ??
                'application/json',
            }
          : {}),
      },
      body,
      cache: 'no-store',
    },
  );
}

async function forward(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const cookieStore = await cookies();

  let accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  /*
   * First attempt using the current access token.
   */
  let backendResponse = await sendBackendRequest(
    request,
    path,
    accessToken,
  );

  let refreshed = false;
  let newTokens: RefreshResult | null = null;

  /*
   * Access token expired/invalid.
   *
   * Only attempt refresh if a refresh token exists.
   */
  if (backendResponse.status === 401 && refreshToken) {
    newTokens = await refreshSession(refreshToken);

    if (newTokens) {
      refreshed = true;
      accessToken = newTokens.accessToken;

      /*
       * Retry the original request exactly once.
       */
      backendResponse = await sendBackendRequest(
        request,
        path,
        accessToken,
      );
    }
  }

  const text = await backendResponse.text();

  const response = new NextResponse(text, {
    status: backendResponse.status,
    headers: {
      'Content-Type':
        backendResponse.headers.get('content-type') ??
        'application/json',
    },
  });

  /*
   * Persist rotated tokens.
   *
   * These match the cookie settings used by /api/auth/refresh.
   */
  if (refreshed && newTokens) {
    response.cookies.set('access_token', newTokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    });

    response.cookies.set('refresh_token', newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  /*
   * Refresh failed.
   *
   * Clear the session so the browser doesn't keep sending
   * an invalid refresh token.
   */
  if (backendResponse.status === 401 && refreshToken && !newTokens) {
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
  }

  return response;
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;