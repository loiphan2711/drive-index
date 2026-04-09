'use client';

import { Kbd } from '@heroui/react';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/common/Button';
import { SearchModal } from '@/components/SearchModal';
import { HEADERLESS_PATHS } from '@/constants/path';

export const Header = () => {
  const pathname = usePathname();

  if (HEADERLESS_PATHS.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-foreground bg-default">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-foreground/45">
              Workspace
            </p>
            <h1 className="truncate font-display text-xl tracking-wide uppercase">
              Drive Index
            </h1>
          </div>

          <SearchModal
            trigger={(open, onOpen) => (
              <Button
                appearance="outline"
                aria-expanded={open}
                aria-haspopup="dialog"
                className="sm:min-w-0 px-3 sm:max-w-sm sm:flex-1 sm:justify-between sm:px-3 sm:py-2"
                onPress={onOpen}
                type="button"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Search aria-hidden className="size-4 shrink-0" />
                  <span className="hidden truncate sm:inline">
                    Search files...
                  </span>
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
              </Button>
            )}
          />
        </div>
      </header>
    </>
  );
};
