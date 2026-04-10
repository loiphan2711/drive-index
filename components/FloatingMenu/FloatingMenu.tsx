'use client';

import type { Key } from 'react';
import type { Theme } from '@/context/theme';
import { Header, ListBox, Popover, Separator } from '@heroui/react';
import {
  LayoutGrid,
  LogIn,
  LogOut,
  Rows3,
  SlidersHorizontal,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { startTransition, useSyncExternalStore } from 'react';

import { THEME_ICONS } from '@/constants/icon';
import { HEADERLESS_PATHS, PAGE_PATHS } from '@/constants/path';
import { THEMES } from '@/context/theme';
import { useTheme } from '@/context/useTheme';
import { useViewMode } from '@/context/useViewMode';
import { useSignOut } from '@/hooks/useAuth';
import { useAuthUser } from '@/hooks/useAuthUser';

const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const isTheme = (value: Key | null): value is Theme =>
  value === 'light' || value === 'dark' || value === 'system';

const isViewMode = (value: Key | null): value is 'grid' | 'table' =>
  value === 'grid' || value === 'table';

const getSingleSelectedKey = (selection: 'all' | Set<Key>) => {
  if (selection === 'all') {
    return null;
  }

  const [firstKey] = selection;
  return firstKey ?? null;
};

export const FloatingMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { setViewMode, viewMode } = useViewMode();
  const { isLoading: isAuthUserLoading, user } = useAuthUser();
  const { trigger: triggerSignOut, isMutating: isSigningOut } = useSignOut();
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
    void triggerSignOut()
      .then(() => {
        router.replace(PAGE_PATHS.login);
        router.refresh();
      })
      .catch(() => null);
  };

  const goToLogin = () => {
    router.push(PAGE_PATHS.login);
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Popover>
        <Popover.Trigger
          aria-label="Open settings menu"
          className="shadow-pixel flex size-14 items-center justify-center rounded-none border-2 border-foreground bg-primary text-white transition-[transform,box-shadow] duration-100 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <SlidersHorizontal aria-hidden className="size-5" />
        </Popover.Trigger>
        <Popover.Content
          placement="top end"
          className="shadow-pixel w-52 rounded-none border-2 border-foreground bg-background p-1"
        >
          <Popover.Dialog>
            <ListBox
              aria-label="View mode"
              className="bg-transparent p-0"
              selectedKeys={new Set([viewMode])}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const nextMode = getSingleSelectedKey(keys);
                if (!isViewMode(nextMode) || nextMode === viewMode) {
                  return;
                }

                startTransition(() => {
                  setViewMode(nextMode);
                });
              }}
            >
              <ListBox.Section>
                <Header className="px-2 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/40 sm:text-[11px]">
                  View Mode
                </Header>
                <ListBox.Item id="grid" textValue="Grid">
                  <div className="flex w-full items-center gap-2">
                    <LayoutGrid aria-hidden className="size-4" />
                    <span>Grid</span>
                    <ListBox.ItemIndicator className="ml-auto text-primary" />
                  </div>
                </ListBox.Item>
                <ListBox.Item id="table" textValue="Table">
                  <div className="flex w-full items-center gap-2">
                    <Rows3 aria-hidden className="size-4" />
                    <span>Table</span>
                    <ListBox.ItemIndicator className="ml-auto text-primary" />
                  </div>
                </ListBox.Item>
              </ListBox.Section>
            </ListBox>

            <Separator className="my-1 border-foreground/25" />

            <ListBox
              aria-label="Theme"
              className="bg-transparent p-0"
              selectedKeys={new Set([currentTheme])}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const nextTheme = getSingleSelectedKey(keys);
                if (!isTheme(nextTheme) || nextTheme === currentTheme) {
                  return;
                }

                startTransition(() => {
                  setTheme(nextTheme);
                });
              }}
            >
              <ListBox.Section>
                <Header className="px-2 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/40 sm:text-[11px]">
                  Theme
                </Header>
                {THEMES.map((nextTheme) => (
                  <ListBox.Item
                    id={nextTheme}
                    key={nextTheme}
                    textValue={THEME_LABELS[nextTheme]}
                  >
                    <div className="flex w-full items-center gap-2">
                      {THEME_ICONS[nextTheme]}
                      <span>{THEME_LABELS[nextTheme]}</span>
                      <ListBox.ItemIndicator className="ml-auto text-primary" />
                    </div>
                  </ListBox.Item>
                ))}
              </ListBox.Section>
            </ListBox>

            {!isAuthUserLoading && (
              <>
                <Separator className="my-1 border-foreground/25" />

                <ListBox
                  aria-label="Account actions"
                  className="bg-transparent p-0"
                  selectionMode="none"
                  onAction={(key) => {
                    if (key === 'login') {
                      goToLogin();
                    }

                    if (key === 'logout') {
                      signOut();
                    }
                  }}
                >
                  <ListBox.Section>
                    <Header className="px-2 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/40 sm:text-[11px]">
                      Account
                    </Header>
                    {user ? (
                      <ListBox.Item
                        id="logout"
                        isDisabled={isSigningOut}
                        textValue="Logout"
                        variant="danger"
                      >
                        <div className="flex w-full items-center gap-2">
                          <LogOut aria-hidden className="size-4" />
                          <span>
                            {isSigningOut ? 'Signing out...' : 'Logout'}
                          </span>
                        </div>
                      </ListBox.Item>
                    ) : (
                      <ListBox.Item id="login" textValue="Login">
                        <div className="flex w-full items-center gap-2">
                          <LogIn aria-hidden className="size-4" />
                          <span>Login</span>
                        </div>
                      </ListBox.Item>
                    )}
                  </ListBox.Section>
                </ListBox>
              </>
            )}
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
};
