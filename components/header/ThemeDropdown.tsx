'use client';

import type { Key } from 'react';
import type { Theme } from '@/context/theme';

import { Dropdown } from '@heroui/react';
import { Check } from 'lucide-react';
import { startTransition, useSyncExternalStore } from 'react';

import { THEME_ICONS } from '@/constants/icon';
import { THEMES } from '@/context/theme';
import { useTheme } from '@/context/useTheme';

const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export const ThemeDropdown = () => {
  const { setTheme, theme } = useTheme();
  const itemClassName =
    'rounded-lg px-2 py-1.5 text-sm text-foreground/75 data-[hover=true]:bg-foreground/6 data-[hover=true]:text-foreground data-[selected=true]:text-foreground';
  // Check if the component is mounted to avoid hydration mismatch when rendering theme icons on the server
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
        className="flex size-10 items-center justify-center rounded-lg border border-foreground/10 bg-background/70 transition-colors hover:bg-foreground/4"
      >
        {THEME_ICONS[currentTheme]}
      </Dropdown.Trigger>
      <Dropdown.Popover
        placement="bottom end"
        className="min-w-44 rounded-xl border border-foreground/10 bg-background shadow-[0_8px_32px_-8px_rgba(28,32,43,0.25)] p-1"
      >
        <Dropdown.Menu
          aria-label="Select theme"
          onAction={handleAction}
          selectedKeys={new Set([currentTheme])}
          selectionMode="single"
          className="bg-transparent p-0"
        >
          {THEMES.map((t) => (
            <Dropdown.Item
              key={t}
              id={t}
              textValue={THEME_LABELS[t]}
              className={itemClassName}
            >
              <div className="flex items-center gap-2 w-full">
                {THEME_ICONS[t]}
                <span>{THEME_LABELS[t]}</span>
                {currentTheme === t && (
                  <Check
                    aria-hidden
                    className="ml-auto size-4 text-[#7107e7]"
                  />
                )}
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
