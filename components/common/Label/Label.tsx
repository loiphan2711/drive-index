'use client';

import type { ComponentPropsWithRef } from 'react';
import type { LabelVariants } from './variants';

import { cn, Label as HeroUILabel } from '@heroui/react';

import { labelVariants } from './variants';

type LabelProps = ComponentPropsWithRef<typeof HeroUILabel> & LabelVariants;

export const Label = ({ className, ...rest }: LabelProps) => (
  <HeroUILabel className={cn(labelVariants(), className)} {...rest} />
);
