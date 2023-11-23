import { USER_COOKIES_STORAGE_KEY } from '@/constants/keys';
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const user = request.cookies.get(USER_COOKIES_STORAGE_KEY)?.value;
  const signInUrl = new URL('/', request.url);
  const dashboardUrl = new URL('/dashboard', request.url);
  if (!user) {
    if (['/', '/sign-up'].includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.redirect(signInUrl);
  }
  if (['/', '/sign-up'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(dashboardUrl);
  }
}

export const config = {
  matcher: ['/', '/sign-up', '/dashboard/:path*'],
};
