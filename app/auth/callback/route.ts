import { NextResponse } from 'next/server';

import { PAGE_PATHS } from '@/constants/path';
import { createClient } from '@/lib/supabase/server';

const getSafeRedirectPath = (candidate: string | null) => {
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) {
    return PAGE_PATHS.dashboard;
  }

  return candidate;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=auth_failed', requestUrl.origin),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL('/login?error=auth_failed', requestUrl.origin),
    );
  }

  const nextPath = getSafeRedirectPath(requestUrl.searchParams.get('next'));

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
