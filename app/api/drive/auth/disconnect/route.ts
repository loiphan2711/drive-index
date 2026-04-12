import { NextResponse } from 'next/server';

import { revokeGoogleToken } from '@/lib/google/auth';
import {
  deleteGoogleTokens,
  getGoogleTokens,
  GoogleTokenStorageError,
} from '@/lib/google/tokens';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const tokens = await getGoogleTokens(supabase, user.id);

    if (tokens) {
      try {
        await revokeGoogleToken(tokens.refresh_token || tokens.access_token);
      } catch {
        // Local disconnect should still succeed when Google revocation is unavailable.
      }

      await deleteGoogleTokens(supabase, user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof GoogleTokenStorageError &&
      error.code === 'missing_table'
    ) {
      return NextResponse.json(
        {
          code: 'google_storage_not_ready',
          error:
            'Google Drive token storage is missing. Apply the Supabase migration for public.google_tokens.',
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Could not disconnect Google Drive.',
      },
      { status: 500 },
    );
  }
}
