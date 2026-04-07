import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { updateSession } from '@/lib/supabase/middleware';

const PUBLIC_PATHS = new Set(['/login', '/auth/callback']);
const PUBLIC_PREFIXES = ['/api/auth/'];

const isPublicPath = (pathname: string) => {
  if (PUBLIC_PATHS.has(pathname)) {
    return true;
  }

  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

const getSafeNextPath = (request: NextRequest) => {
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (!nextPath.startsWith('/') || nextPath.startsWith('//')) {
    return null;
  }

  if (nextPath === '/login') {
    return null;
  }

  return nextPath;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user } = await updateSession(request);

  if (isPublicPath(pathname)) {
    return response;
  }

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';

    const nextPath = getSafeNextPath(request);
    if (nextPath) {
      loginUrl.searchParams.set('next', nextPath);
    }

    const redirectResponse = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
