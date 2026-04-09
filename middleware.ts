import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { PAGE_PATHS } from '@/constants/path';
import { updateSession } from '@/lib/supabase/middleware';

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

  const isDashboardRoute =
    pathname === PAGE_PATHS.dashboard ||
    pathname.startsWith(`${PAGE_PATHS.dashboard}/`);

  if (!isDashboardRoute) {
    return response;
  }

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = PAGE_PATHS.login;
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
