import type { SupabaseClient } from '@supabase/supabase-js';

import type { GoogleTokens } from '@/type/google';

const GOOGLE_TOKENS_TABLE = 'google_tokens';
const MISSING_TOKENS_TABLE_MESSAGE =
  "Could not find the table 'public.google_tokens' in the schema cache";

export class GoogleTokenStorageError extends Error {
  code: 'missing_table' | 'unknown';

  constructor(message: string, code: 'missing_table' | 'unknown' = 'unknown') {
    super(message);
    this.name = 'GoogleTokenStorageError';
    this.code = code;
  }
}

type GoogleTokenRow = GoogleTokens & {
  expiry_date: number | string | null;
  updated_at?: string;
  user_id: string;
};

const toGoogleTokenStorageError = (error: {
  code?: string | null;
  message: string;
}) => {
  if (
    error.code === 'PGRST205' ||
    error.message.includes(MISSING_TOKENS_TABLE_MESSAGE) ||
    error.message.includes('relation "public.google_tokens" does not exist')
  ) {
    return new GoogleTokenStorageError(
      'Google Drive token storage is not set up yet. Run the Supabase migration for public.google_tokens.',
      'missing_table',
    );
  }

  return new GoogleTokenStorageError(error.message);
};

export const getGoogleTokens = async (
  supabaseClient: SupabaseClient,
  userId: string,
) => {
  const { data, error } = await supabaseClient
    .from(GOOGLE_TOKENS_TABLE)
    .select('access_token, refresh_token, expiry_date')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw toGoogleTokenStorageError(error);
  }

  if (!data) {
    return null;
  }

  const row = data as GoogleTokenRow;

  return {
    access_token: row.access_token,
    expiry_date:
      typeof row.expiry_date === 'string'
        ? Number(row.expiry_date)
        : row.expiry_date,
    refresh_token: row.refresh_token,
  };
};

export const saveGoogleTokens = async (
  supabaseClient: SupabaseClient,
  userId: string,
  tokens: GoogleTokens,
) => {
  const payload: GoogleTokenRow = {
    user_id: userId,
    updated_at: new Date().toISOString(),
    ...tokens,
  };

  const { error } = await supabaseClient
    .from(GOOGLE_TOKENS_TABLE)
    .upsert(payload, { onConflict: 'user_id' });

  if (error) {
    throw toGoogleTokenStorageError(error);
  }
};

export const deleteGoogleTokens = async (
  supabaseClient: SupabaseClient,
  userId: string,
) => {
  const { error } = await supabaseClient
    .from(GOOGLE_TOKENS_TABLE)
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw toGoogleTokenStorageError(error);
  }
};
