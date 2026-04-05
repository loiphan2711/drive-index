'use client';

import { use } from 'react';

import { ViewModeContext } from './viewMode';

export const useViewMode = () => {
  const context = use(ViewModeContext);

  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }

  return context;
};
