'use client';

import type { FetchError } from '@/lib/swr/fetcher';
import type { DriveItem } from '@/type/file';
import useSWR from 'swr';

import { fetchDriveItems } from '@/services/drive';

type DriveItemsKey = readonly ['drive-items', string, string];

const fetchDriveItemsByKey = ([, requestedFolderId, search]: DriveItemsKey) =>
  fetchDriveItems(requestedFolderId, search || undefined);

export const useDriveItems = (folderId: string | null, search?: string) =>
  useSWR<DriveItem[], FetchError, DriveItemsKey | null>(
    folderId ? ['drive-items', folderId, search ?? ''] : null,
    fetchDriveItemsByKey,
  );
