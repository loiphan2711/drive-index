'use client';

import type { ResolvedTheme, Theme } from './theme';

import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { forcedTheme, resolvedTheme, setTheme, systemTheme, theme, themes } =
    useNextTheme();

  return {
    forcedTheme: forcedTheme as Theme | undefined,
    resolvedTheme: resolvedTheme as ResolvedTheme | undefined,
    setTheme: (nextTheme: Theme) => setTheme(nextTheme),
    systemTheme: systemTheme as ResolvedTheme | undefined,
    theme: theme as Theme | undefined,
    themes: themes as Theme[],
  };
};
