import { NextRequest, NextResponse } from 'next/server';

function isExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1];
    if (!payload) return false;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded.exp === 'number' && decoded.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isProtected && token && isExpired(token) && req.cookies.get('refresh_token')?.value) {
    return refreshAndContinue(req);
  }

  return NextResponse.next();
}

async function refreshAndContinue(req: NextRequest): Promise<NextResponse> {
  const refreshResponse = await fetch(new URL('/api/auth/refresh', req.url), {
    method: 'POST',
    headers: { cookie: req.headers.get('cookie') ?? '' },
  });

  if (!refreshResponse.ok) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const response = NextResponse.next();
  for (const cookie of refreshResponse.headers.getSetCookie()) {
    response.headers.append('set-cookie', cookie);
  }
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};