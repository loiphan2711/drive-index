import type { Theme } from '@/context/theme';

import { Monitor, Moon, Sun } from 'lucide-react';

export const THEME_ICONS: Record<Theme, React.ReactNode> = {
  dark: <Moon aria-hidden className="size-4" />,
  light: <Sun aria-hidden className="size-4" />,
  system: <Monitor aria-hidden className="size-4" />,
};
