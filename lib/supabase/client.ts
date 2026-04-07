import type { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

import { getSupabaseEnv } from './config';

let supabaseClient: SupabaseClient | undefined;

export const createClient = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { supabasePublishableKey, supabaseUrl } = getSupabaseEnv();
  supabaseClient = createBrowserClient(supabaseUrl, supabasePublishableKey);

  return supabaseClient;
};
