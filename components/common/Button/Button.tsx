'use client';

import type { ComponentPropsWithRef } from 'react';
import type { ButtonVariants } from './variants';

import { cn, Button as HeroUIButton } from '@heroui/react';

import { buttonVariants } from './variants';

type ButtonProps = ComponentPropsWithRef<typeof HeroUIButton> &
  ButtonVariants & {
    isLoading?: boolean;
    loadingText?: string;
  };

export const Button = ({
  appearance = 'primary',
  fullWidth,
  className,
  children,
  isDisabled,
  isLoading = false,
  loadingText,
  ...rest
}: ButtonProps) => (
  <HeroUIButton
    className={cn(buttonVariants({ appearance, fullWidth }), className)}
    fullWidth={fullWidth}
    isDisabled={isLoading || isDisabled}
    {...rest}
  >
    {isLoading ? (
      <span className="inline-flex items-center gap-2">
        <span className="pacman-btn-loader" aria-hidden="true" />
        {loadingText ? <span>{loadingText}</span> : null}
      </span>
    ) : (
      children
    )}
  </HeroUIButton>
);
