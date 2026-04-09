import type { VariantProps } from '@heroui/react';

import { tv } from '@heroui/react';

export const buttonVariants = tv({
  base: 'group relative',
  variants: {
    appearance: {
      primary: [
        'h-12 rounded-none border-2 border-foreground bg-primary',
        'px-4 text-[10px] font-normal uppercase tracking-[0.12em] text-white',
        'shadow-pixel transition-[transform,box-shadow] duration-100',
        'hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-pixel',
      ],
      secondary: [
        'h-11 rounded-none border-2 border-foreground bg-background',
        'px-4 text-[10px] font-normal uppercase tracking-[0.10em] text-foreground',
        'shadow-pixel-sm transition-[transform,box-shadow,border-color,background-color,color] duration-100',
        'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-pixel-sm',
      ],
      outline: [
        'h-auto rounded-none border-dotted-2 border-foreground/40 bg-background',
        'p-2.5 text-foreground/65 transition-colors',
        'hover:border-foreground hover:bg-foreground/5',
      ],
      icon: [
        'size-8 shrink-0 rounded-none',
        'border-2 border-(--cmdk-kbd-border) bg-(--cmdk-kbd-bg)',
        'text-(--cmdk-text-muted) transition-colors hover:text-(--cmdk-text)',
        'sm:size-9',
      ],
      filter: [
        'h-auto rounded-none border-dotted-2 px-3 py-1.5',
        'text-[10px] font-normal uppercase tracking-[0.10em]',
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
