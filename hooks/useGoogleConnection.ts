'use client';

import type { FetchError } from '@/lib/swr/fetcher';
import useSWR from 'swr';

import { jsonFetcher } from '@/lib/swr/fetcher';

type GoogleConnectionStatus = {
  connected: boolean;
};

export const useGoogleConnection = () =>
  useSWR<GoogleConnectionStatus, FetchError>(
    '/api/drive/auth/status',
    jsonFetcher,
  );
