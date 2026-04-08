'use client';

import { cn, InputOTP, REGEXP_ONLY_DIGITS } from '@heroui/react';
import { useEffect, useRef } from 'react';

const OTP_LENGTH = 8;

export type OtpInputProps = {
  autoFocusFirst?: boolean;
  value: string;
  onChange: (val: string) => void;
};

const slotClass = cn(
  'h-10 w-10 rounded-xl border font-mono text-base font-bold tabular-nums caret-transparent transition-all duration-200 sm:h-11 sm:w-11',
  'bg-white/95 text-foreground shadow-[inset_0_1px_2px_rgb(var(--ink-rgb)/0.06)]',
  'dark:bg-background/85 dark:shadow-[inset_0_1px_0_rgb(var(--white-rgb)/0.04)]',
  'border-foreground/20 hover:border-foreground/32',
  'dark:border-foreground/12 dark:hover:border-foreground/24',
  'data-[active=true]:border-primary/60 data-[active=true]:bg-primary/11 data-[active=true]:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.14)]',
  'data-[active=true]:ring-primary',
  'dark:data-[active=true]:border-primary/60 dark:data-[active=true]:bg-primary/8 dark:data-[active=true]:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.14)]',
  'data-[filled=true]:border-primary/55 data-[filled=true]:bg-primary/12 data-[filled=true]:shadow-[0_14px_30px_-24px_rgb(var(--primary-rgb)/0.7),inset_0_1px_2px_rgb(var(--ink-rgb)/0.04)]',
  'dark:data-[filled=true]:border-primary/45 dark:data-[filled=true]:bg-primary/6 dark:data-[filled=true]:shadow-[0_14px_30px_-24px_rgb(var(--primary-rgb)/0.9),inset_0_1px_0_rgb(var(--white-rgb)/0.44)]',
);

export const OtpInput = ({
  autoFocusFirst,
  value,
  onChange,
}: OtpInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusFirst) {
      inputRef.current?.focus();
    }
  }, [autoFocusFirst]);

  return (
    <InputOTP
      ref={inputRef}
      maxLength={OTP_LENGTH}
      value={value}
      onChange={onChange}
      pattern={REGEXP_ONLY_DIGITS}
      autoComplete="one-time-code"
      inputMode="numeric"
      aria-label={`${OTP_LENGTH}-digit verification code`}
    >
      <InputOTP.Group className="gap-1.5">
        {Array.from({ length: 4 }, (_, i) => (
          <InputOTP.Slot key={i} index={i} className={slotClass} />
        ))}
      </InputOTP.Group>
      <InputOTP.Separator className="h-px w-3 rounded-full bg-foreground/25" />
      <InputOTP.Group className="gap-1.5">
        {Array.from({ length: 4 }, (_, i) => (
          <InputOTP.Slot key={i + 4} index={i + 4} className={slotClass} />
        ))}
      </InputOTP.Group>
    </InputOTP>
  );
};
