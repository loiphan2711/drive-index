'use client';

import type { Input as HeroUIInput } from '@heroui/react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { InputVariants } from './variants';

import { cn, Input as HeroUIInputComponent } from '@heroui/react';

import { inputVariants } from './variants';

type InputProps = ComponentPropsWithRef<typeof HeroUIInput.Root> &
  InputVariants & {
    startContent?: ReactNode;
    endContent?: ReactNode;
    wrapperClassName?: string;
  };

export const Input = ({
  className,
  endContent,
  fullWidth,
  startContent,
  wrapperClassName,
  ...rest
}: InputProps) => {
  const styles = inputVariants({ fullWidth });

  return (
    <div className={cn(styles.base(), wrapperClassName)}>
      {startContent ? (
        <div className={styles.prefix()}>{startContent}</div>
      ) : null}

      <HeroUIInputComponent
        className={cn(styles.input(), className)}
        {...rest}
      />

      {endContent ? <div className={styles.suffix()}>{endContent}</div> : null}
    </div>
  );
};
