'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import { ViewModeContext } from './viewMode';

export const ViewModeProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <ViewModeContext value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext>
  );
};
