'use client';

import type { ComponentPropsWithRef } from 'react';
import type { ButtonVariants } from './variants';

import { cn, Button as HeroUIButton } from '@heroui/react';

import { buttonVariants } from './variants';

type ButtonProps = ComponentPropsWithRef<typeof HeroUIButton> & ButtonVariants;

export const Button = ({
  appearance = 'primary',
  fullWidth,
  className,
  ...rest
}: ButtonProps) => (
  <HeroUIButton
    className={cn(buttonVariants({ appearance, fullWidth }), className)}
    fullWidth={fullWidth}
    {...rest}
  />
);
