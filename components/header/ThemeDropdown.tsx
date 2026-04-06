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
        className="flex size-10 items-center justify-center rounded-xl border border-foreground/10 bg-background/70 transition-colors hover:bg-foreground/4"
      >
        {THEME_ICONS[currentTheme]}
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end" className="min-w-44">
        <Dropdown.Menu
          aria-label="Select theme"
          onAction={handleAction}
          selectedKeys={new Set([currentTheme])}
          selectionMode="single"
        >
          {THEMES.map((t) => (
            <Dropdown.Item key={t} id={t} textValue={THEME_LABELS[t]}>
              <div className="flex items-center gap-2 w-full">
                {THEME_ICONS[t]}
                <span>{THEME_LABELS[t]}</span>
                {currentTheme === t && (
                  <Check aria-hidden className="ml-auto size-4" />
                )}
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
