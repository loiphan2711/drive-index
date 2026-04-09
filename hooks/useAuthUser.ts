'use client';

import type { User } from '@supabase/supabase-js';
import useSWR from 'swr';

import { createClient } from '@/lib/supabase/client';

const getAuthUser = async (): Promise<User | null> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message || 'Could not load the authenticated user.');
  }

  return data.user;
};

export const useAuthUser = () => {
  const { data, isLoading } = useSWR('auth/user', getAuthUser, {
    revalidateOnFocus: false,
  });

  return {
    user: data ?? null,
    isLoading,
  };
};
