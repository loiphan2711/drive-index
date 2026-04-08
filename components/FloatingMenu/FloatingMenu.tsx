'use client';

import type { Theme } from '@/context/theme';
import { cn, Dropdown, Separator } from '@heroui/react';

import {
  Check,
  LayoutGrid,
  LogOut,
  Rows3,
  SlidersHorizontal,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { startTransition, useSyncExternalStore, useTransition } from 'react';

import { THEME_ICONS } from '@/constants/icon';
import { THEMES } from '@/context/theme';
import { useTheme } from '@/context/useTheme';
import { useViewMode } from '@/context/useViewMode';
import { createClient } from '@/lib/supabase/client';

const HEADERLESS_PATHS = ['/login', '/auth/callback'];
const ITEM_CLASS_NAME =
  'rounded-lg px-2 py-1.5 text-sm text-foreground/75 data-[hover=true]:bg-foreground/6 data-[hover=true]:text-foreground';
const SECTION_LABEL_CLASS_NAME =
  'px-2 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40';

const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export const FloatingMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { setViewMode, viewMode } = useViewMode();
  const [isSigningOut, startSigningOut] = useTransition();
  // Avoid hydration mismatch while resolving current theme icon.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (HEADERLESS_PATHS.some((path) => pathname.startsWith(path))) {
    return null;
  }

  const currentTheme: Theme =
    mounted && (theme === 'light' || theme === 'dark' || theme === 'system')
      ? theme
      : 'system';

  const signOut = () => {
    startSigningOut(() => {
      void (async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.replace('/login');
        router.refresh();
      })();
    });
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Dropdown>
        <Dropdown.Trigger
          aria-label="Open settings menu"
          className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_24px_-4px_rgb(var(--primary-rgb)/0.5)] transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <SlidersHorizontal aria-hidden className="size-5" />
        </Dropdown.Trigger>
        <Dropdown.Popover
          placement="top end"
          className="w-52 rounded-xl border border-foreground/10 bg-background p-1 shadow-[0_8px_32px_-8px_rgb(var(--ink-rgb)/0.25)]"
        >
          <Dropdown.Menu
            aria-label="Settings"
            selectionMode="none"
            className="bg-transparent p-0"
          >
            <Dropdown.Section aria-label="View mode">
              <Dropdown.Item
                key="view-mode-label"
                isDisabled
                className="pointer-events-none cursor-default p-0 data-[hover=true]:bg-transparent"
                textValue="View mode section"
              >
                <p className={SECTION_LABEL_CLASS_NAME}>View Mode</p>
              </Dropdown.Item>
              <Dropdown.Item
                key="grid"
                textValue="Grid"
                className={ITEM_CLASS_NAME}
                onAction={() => {
                  startTransition(() => {
                    setViewMode('grid');
                  });
                }}
              >
                <div className="flex w-full items-center gap-2">
                  <LayoutGrid aria-hidden className="size-4" />
                  <span>Grid</span>
                  {viewMode === 'grid' && (
                    <Check
                      aria-hidden
                      className="ml-auto size-4 text-primary"
                    />
                  )}
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                key="table"
                textValue="Table"
                className={ITEM_CLASS_NAME}
                onAction={() => {
                  startTransition(() => {
                    setViewMode('table');
                  });
                }}
              >
                <div className="flex w-full items-center gap-2">
                  <Rows3 aria-hidden className="size-4" />
                  <span>Table</span>
                  {viewMode === 'table' && (
                    <Check
                      aria-hidden
                      className="ml-auto size-4 text-primary"
                    />
                  )}
                </div>
              </Dropdown.Item>
            </Dropdown.Section>

            <Separator className="my-1 border-foreground/10" />

            <Dropdown.Section aria-label="Theme">
              <Dropdown.Item
                key="theme-label"
                isDisabled
                className="pointer-events-none cursor-default p-0 data-[hover=true]:bg-transparent"
                textValue="Theme section"
              >
                <p className={SECTION_LABEL_CLASS_NAME}>Theme</p>
              </Dropdown.Item>
              {THEMES.map((nextTheme) => (
                <Dropdown.Item
                  key={nextTheme}
                  textValue={THEME_LABELS[nextTheme]}
                  className={ITEM_CLASS_NAME}
                  onAction={() => {
                    startTransition(() => {
                      setTheme(nextTheme);
                    });
                  }}
                >
                  <div className="flex w-full items-center gap-2">
                    {THEME_ICONS[nextTheme]}
                    <span>{THEME_LABELS[nextTheme]}</span>
                    {currentTheme === nextTheme && (
                      <Check
                        aria-hidden
                        className="ml-auto size-4 text-primary"
                      />
                    )}
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown.Section>

            <Separator className="my-1 border-foreground/10" />

            <Dropdown.Section aria-label="Account">
              <Dropdown.Item
                key="logout"
                isDisabled={isSigningOut}
                textValue="Logout"
                onAction={signOut}
                className={cn(
                  ITEM_CLASS_NAME,
                  'text-danger data-[hover=true]:bg-danger/8 data-[hover=true]:text-danger',
                )}
              >
                <div className="flex w-full items-center gap-2">
                  <LogOut aria-hidden className="size-4" />
                  <span>{isSigningOut ? 'Signing out...' : 'Logout'}</span>
                </div>
              </Dropdown.Item>
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
};
