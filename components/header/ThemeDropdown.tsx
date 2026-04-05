'use client';

import type { Key } from 'react';
import type { Theme } from '@/context/theme';

import { Dropdown } from '@heroui/react';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { startTransition, useSyncExternalStore } from 'react';

import { THEME_ICONS } from '@/constants/icon';
import { useTheme } from '@/context/useTheme';

export const ThemeDropdown = () => {
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const currentTheme: Theme =
    mounted && (theme === 'light' || theme === 'dark' || theme === 'system')
      ? theme
      : 'system';

  const handleAction = (key: Key) => {
    if (key === 'light' || key === 'dark' || key === 'system') {
      startTransition(() => {
        setTheme(key);
      });
    }
  };

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label={`Current theme: ${currentTheme}. Click to change.`}
        className="flex size-10 items-center justify-center rounded-xl border border-foreground/10 bg-background/70 transition-colors hover:bg-foreground/4"
      >
        {THEME_ICONS[currentTheme]}
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          aria-label="Select theme"
          onAction={handleAction}
          selectedKeys={new Set([currentTheme])}
          selectionMode="single"
        >
          <Dropdown.Item id="light" textValue="Light">
            <div className="flex items-center gap-2">
              <Sun aria-hidden className="size-4" />
              <span>Light</span>
              {currentTheme === 'light' && (
                <Check aria-hidden className="ml-auto size-4" />
              )}
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="dark" textValue="Dark">
            <div className="flex items-center gap-2">
              <Moon aria-hidden className="size-4" />
              <span>Dark</span>
              {currentTheme === 'dark' && (
                <Check aria-hidden className="ml-auto size-4" />
              )}
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="system" textValue="System">
            <div className="flex items-center gap-2">
              <Monitor aria-hidden className="size-4" />
              <span>System</span>
              {currentTheme === 'system' && (
                <Check aria-hidden className="ml-auto size-4" />
              )}
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
