import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const pathname = req.nextUrl.pathname;
  const isProtected = pathname === '/dashboard' || pathname.startsWith('/dashboard/') || pathname === '/admin' || pathname.startsWith('/admin/');

  if (isProtected && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
