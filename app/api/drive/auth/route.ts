import { randomUUID } from 'node:crypto';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { PAGE_PATHS } from '@/constants/path';
import {
  generateGoogleAuthUrl,
  GOOGLE_OAUTH_STATE_COOKIE,
} from '@/lib/google/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL(PAGE_PATHS.login, requestUrl.origin);
    loginUrl.searchParams.set('next', PAGE_PATHS.googleAuth);

    return NextResponse.redirect(loginUrl);
  }

  const state = randomUUID();
  const cookieStore = await cookies();

  cookieStore.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: '/',
    sameSite: 'lax',
    secure: requestUrl.protocol === 'https:',
  });

  return NextResponse.redirect(generateGoogleAuthUrl(requestUrl.origin, state));
}
