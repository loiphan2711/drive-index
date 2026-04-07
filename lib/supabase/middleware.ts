import type { User } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

import { getSupabaseEnv } from './config';

type SessionUpdateResult = {
  response: NextResponse;
  user: User | null;
};

export const updateSession = async (
  request: NextRequest,
): Promise<SessionUpdateResult> => {
  let response = NextResponse.next({
    request,
  });

  const { supabasePublishableKey, supabaseUrl } = getSupabaseEnv();

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, options, value }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
};
