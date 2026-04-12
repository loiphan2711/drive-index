import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { PAGE_PATHS } from '@/constants/path';
import {
  exchangeGoogleCodeForTokens,
  GOOGLE_OAUTH_STATE_COOKIE,
} from '@/lib/google/auth';
import { GoogleTokenStorageError, saveGoogleTokens } from '@/lib/google/tokens';
import { createClient } from '@/lib/supabase/server';

const redirectToFileIndex = (origin: string, error?: string) => {
  const url = new URL(PAGE_PATHS.fileIndex, origin);

  if (error) {
    url.searchParams.set('error', error);
  }

  return NextResponse.redirect(url);
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');
  const cookieStore = await cookies();
  const storedState = cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  cookieStore.delete(GOOGLE_OAUTH_STATE_COOKIE);

  if (!code) {
    return redirectToFileIndex(requestUrl.origin, 'google_auth_failed');
  }

  if (!state || !storedState || state !== storedState) {
    return redirectToFileIndex(requestUrl.origin, 'google_auth_state_mismatch');
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL(PAGE_PATHS.login, requestUrl.origin);
    loginUrl.searchParams.set('next', PAGE_PATHS.googleAuth);

    return NextResponse.redirect(loginUrl);
  }

  try {
    const tokens = await exchangeGoogleCodeForTokens(requestUrl.origin, code);
    await saveGoogleTokens(supabase, user.id, tokens);
  } catch (error) {
    if (
      error instanceof GoogleTokenStorageError &&
      error.code === 'missing_table'
    ) {
      return redirectToFileIndex(requestUrl.origin, 'google_storage_not_ready');
    }

    return redirectToFileIndex(requestUrl.origin, 'google_auth_failed');
  }

  return redirectToFileIndex(requestUrl.origin);
}
