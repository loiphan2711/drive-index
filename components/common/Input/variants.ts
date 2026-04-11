import type { VariantProps } from '@heroui/react';

import { tv } from '@heroui/react';

export const inputVariants = tv({
  slots: {
    base: [
      'group flex items-center gap-2.5 rounded-none border-2 px-3.5 py-2.5 shadow-none',
      'w-full border-foreground/40 bg-background text-foreground hover:border-foreground',
      'transition-[border-color,box-shadow] duration-100',
      'focus-within:border-primary focus-within:shadow-[2px_2px_0px_var(--primary)]',
      'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
    ],
    input: [
      'min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-foreground shadow-none outline-none',
      'placeholder:text-foreground/28 sm:text-base',
      'focus:outline-none focus-visible:outline-none focus:ring-0 rounded-none',
    ],
    prefix: [
      'h-auto shrink-0 justify-start border-0 bg-transparent p-0 text-foreground/45',
      'transition-colors duration-200 group-focus-within:text-primary',
    ],
    suffix: [
      'h-auto shrink-0 justify-end border-0 bg-transparent p-0 text-foreground/45',
      'transition-colors duration-200 group-focus-within:text-primary',
    ],
  },
  variants: {
    fullWidth: {
      false: {
        base: 'w-auto',
      },
      true: {
        base: 'w-full',
      },
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

export type InputVariants = VariantProps<typeof inputVariants>;
