import { tv } from '@heroui/react';

export const breadcrumbVariants = tv({
  slots: {
    base: [
      'shadow-pixel-sm overflow-x-auto border-dotted-2 border-foreground/30 bg-background px-4 py-3',
    ],
    list: [
      'flex min-w-max flex-wrap items-center font-display text-[11px] uppercase tracking-[0.22em] sm:text-[12px]',
    ],
    item: [
      'inline-flex items-center rounded-none',
      '[&_.breadcrumbs__link]:rounded-none [&_.breadcrumbs__link]:outline-none',
    ],
    separator: ['px-2 text-foreground/40 select-none'],
  },
});
