'use client';

import type { FetchError } from '@/lib/swr/fetcher';
import type { RootFolder } from '@/type/rootFolder';
import useSWR from 'swr';

import { jsonFetcher } from '@/lib/swr/fetcher';

export const useRootFolders = () =>
  useSWR<RootFolder[], FetchError>('/api/drive/folders', jsonFetcher);
