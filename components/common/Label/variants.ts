import type { VariantProps } from '@heroui/react';

import { tv } from '@heroui/react';

export const labelVariants = tv({
  base: 'block text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/45 sm:text-[12px]',
});

export type LabelVariants = VariantProps<typeof labelVariants>;
