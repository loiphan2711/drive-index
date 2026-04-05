'use client';

import { useOverlayState } from '@heroui/react';
import { useEffect, useEffectEvent } from 'react';

import { SearchModal } from './SearchModal';
import { ThemeDropdown } from './ThemeDropdown';
import { ViewModeDropdown } from './ViewModeDropdown';

export const Header = () => {
  const searchModal = useOverlayState({ defaultOpen: false });
  const openSearch = useEffectEvent(() => {
    searchModal.open();
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-foreground/45">
              Workspace
            </p>
            <h1 className="truncate text-lg font-semibold tracking-tight">
              Drive Index
            </h1>
          </div>

          <SearchModal state={searchModal} />

          <ViewModeDropdown />

          <ThemeDropdown />
        </div>
      </header>
    </>
  );
};
