'use client';

import type { ReactNode } from 'react';
import { SWRConfig } from 'swr';

import { jsonFetcher } from './fetcher';

export const SWRProvider = ({ children }: { children: ReactNode }) => (
  <SWRConfig
    value={{
      fetcher: jsonFetcher,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }}
  >
    {children}
  </SWRConfig>
);
