import type { DriveItem } from '@/type/file';

import { jsonFetcher } from '@/lib/swr/fetcher';

export const fetchDriveItems = (folderId: string, search?: string) => {
  const params = new URLSearchParams({ folderId });

  if (search) {
    params.set('search', search);
  }

  return jsonFetcher<DriveItem[]>(`/api/drive/items?${params.toString()}`);
};
