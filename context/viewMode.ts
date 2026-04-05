'use client';

import { createContext } from 'react';

export type ViewMode = 'grid' | 'table';

export type ViewModeContextValue = {
  setViewMode: (mode: ViewMode) => void;
  viewMode: ViewMode;
};

export const ViewModeContext = createContext<ViewModeContextValue | null>(null);
