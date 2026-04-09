import type { DriveItem } from '@/type/file';

import { jsonFetcher } from '@/lib/swr/fetcher';

export const fetchDriveItems = () =>
  jsonFetcher<DriveItem[]>('/api/drive/items');
