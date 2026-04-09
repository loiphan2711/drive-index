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
  'h-10 w-10 rounded-none border-2 font-mono text-base font-bold tabular-nums caret-transparent sm:h-11 sm:w-11',
  'transition-shadow duration-100',
  'bg-background text-foreground border-foreground/40 hover:border-foreground',
  'data-[active=true]:border-primary data-[active=true]:shadow-[2px_2px_0px_var(--primary)]',
  'data-[filled=true]:border-primary data-[filled=true]:bg-primary/10 data-[filled=true]:shadow-[2px_2px_0px_var(--primary)]',
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
      <InputOTP.Separator className="h-px w-3 rounded-none bg-foreground/25" />
      <InputOTP.Group className="gap-1.5">
        {Array.from({ length: 4 }, (_, i) => (
          <InputOTP.Slot key={i + 4} index={i + 4} className={slotClass} />
        ))}
      </InputOTP.Group>
    </InputOTP>
  );
};
