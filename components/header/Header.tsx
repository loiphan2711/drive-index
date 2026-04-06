'use client';

import { Kbd } from '@heroui/react';
import { Search } from 'lucide-react';

import { SearchModal } from '@/components/SearchModal';

import { ThemeDropdown } from './ThemeDropdown';
import { ViewModeDropdown } from './ViewModeDropdown';

export const Header = () => {
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

          <SearchModal
            trigger={(open) => (
              <button
                aria-expanded={open}
                aria-haspopup="dialog"
                className="flex min-w-0 flex-1 items-center justify-between rounded-xl border border-foreground/10 bg-background/70 px-3 py-2 text-foreground/65 shadow-sm transition-colors hover:bg-foreground/4 sm:max-w-sm"
                type="button"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Search aria-hidden className="size-4 shrink-0" />
                  <span className="truncate">Search files...</span>
                </span>
                <span className="hidden items-center gap-1 text-xs text-foreground/45 sm:flex">
                  <Kbd>
                    <Kbd.Abbr keyValue="ctrl" />
                  </Kbd>
                  <Kbd>
                    <Kbd.Abbr keyValue="command" />
                  </Kbd>
                  <Kbd>
                    <Kbd.Content>K</Kbd.Content>
                  </Kbd>
                </span>
              </button>
            )}
          />

          <ViewModeDropdown />

          <ThemeDropdown />
        </div>
      </header>
    </>
  );
};
