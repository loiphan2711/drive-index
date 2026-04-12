import { NextResponse } from 'next/server';

import { getGoogleTokens, GoogleTokenStorageError } from '@/lib/google/tokens';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const tokens = await getGoogleTokens(supabase, user.id);

    return NextResponse.json({ connected: Boolean(tokens) });
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
            : 'Could not check Google Drive connection.',
      },
      { status: 500 },
    );
  }
}
