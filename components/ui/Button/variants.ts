import type { VariantProps } from '@heroui/react';

import { tv } from '@heroui/react';

export const buttonVariants = tv({
  base: 'group relative',
  variants: {
    appearance: {
      primary: [
        'h-12 rounded-[1.15rem]',
        'bg-[linear-gradient(135deg,var(--primary)_0%,var(--secondary)_100%)]',
        'px-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white',
        'shadow-[0_24px_40px_-24px_rgb(var(--primary-rgb)/0.9)]',
        'transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-[0_28px_50px_-24px_rgb(var(--primary-rgb)/0.95)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70',
      ],
      secondary: [
        'h-11 rounded-[1.05rem]',
        'border border-foreground/20 bg-white/85',
        'px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/70',
        'transition-all duration-200',
        'hover:border-foreground/30 hover:bg-white hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'dark:border-foreground/12 dark:bg-background/72 dark:hover:border-foreground/22 dark:hover:bg-foreground/4',
      ],
      outline: [
        'h-auto rounded-lg border border-foreground/10 bg-background/70',
        'p-2.75 text-foreground/65 shadow-sm',
        'transition-colors hover:bg-foreground/4',
      ],
      icon: [
        'size-8 shrink-0 rounded-full',
        'border border-(--cmdk-kbd-border) bg-(--cmdk-kbd-bg)',
        'text-(--cmdk-text-muted) transition-colors hover:text-(--cmdk-text)',
        'sm:size-9',
      ],
      filter: [
        'h-auto rounded-full border px-3 py-1.5',
        'text-[11px] font-semibold uppercase tracking-[0.18em]',
        'transition-colors',
        'border-(--cmdk-kbd-border) bg-(--cmdk-icon-bg) text-(--cmdk-text-muted)',
        'hover:border-(--cmdk-item-hover-border) hover:bg-(--cmdk-item-hover-bg) hover:text-(--cmdk-text)',
      ],
    },
    fullWidth: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    appearance: 'primary',
    fullWidth: false,
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;
