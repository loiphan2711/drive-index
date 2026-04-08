'use client';

import { useEffect, useRef } from 'react';

const OTP_LENGTH = 8;

export type OtpInputProps = {
  autoFocusFirst?: boolean;
  value: string;
  onChange: (val: string) => void;
};

const sanitizeOtp = (rawValue: string) =>
  rawValue.replace(/\D/g, '').slice(0, OTP_LENGTH);

export const OtpInput = ({
  autoFocusFirst,
  value,
  onChange,
}: OtpInputProps) => {
  const desktopInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!autoFocusFirst) {
      return;
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 640px)').matches
    ) {
      desktopInputsRef.current[0]?.focus();
      return;
    }

    mobileInputRef.current?.focus();
  }, [autoFocusFirst]);

  const focusAt = (index: number) => {
    const clamped = Math.max(0, Math.min(OTP_LENGTH - 1, index));
    desktopInputsRef.current[clamped]?.focus();
  };

  const handleDesktopKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        focusAt(index - 1);
      }
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusAt(index - 1);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  const handleDesktopChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const digit = event.target.value.replace(/\D/g, '').slice(-1);
    if (!digit) {
      return;
    }

    const newValue = `${value.slice(0, index)}${digit}${value.slice(index + 1)}`
      .replace(/\s/g, '')
      .slice(0, OTP_LENGTH);

    onChange(newValue);
    if (index < OTP_LENGTH - 1) {
      focusAt(index + 1);
    }
  };

  const handleDesktopPaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);

    onChange(pasted);
    focusAt(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleMobileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(sanitizeOtp(event.target.value));
  };

  const handleMobilePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    onChange(sanitizeOtp(event.clipboardData.getData('text')));
  };

  return (
    <div className="space-y-2.5">
      <input
        ref={mobileInputRef}
        id="otp-mobile"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        value={value}
        onChange={handleMobileChange}
        onPaste={handleMobilePaste}
        onFocus={(event) => event.target.select()}
        aria-label={`${OTP_LENGTH}-digit verification code`}
        className="h-10 w-full rounded-xl border border-foreground/20 bg-white/95 px-3.5 text-center font-mono text-base font-semibold tracking-[0.5em] text-foreground tabular-nums shadow-[inset_0_1px_2px_rgb(var(--ink-rgb)/0.06)] outline-none transition-all duration-200 placeholder:text-foreground/24 focus:border-primary/60 focus:bg-primary/10 focus:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.14)] sm:hidden dark:border-foreground/12 dark:bg-background/85 dark:shadow-[inset_0_1px_0_rgb(var(--white-rgb)/0.04)] dark:focus:bg-primary/8 dark:focus:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.14)]"
      />

      <div
        className="hidden items-center gap-2 sm:flex"
        role="group"
        aria-label={`${OTP_LENGTH}-digit verification code`}
      >
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 }, (_, i) => {
            const digit = value[i] ?? '';
            return (
              <input
                key={i}
                id={`otp-digit-${i + 1}`}
                ref={(el) => {
                  desktopInputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(event) => handleDesktopChange(event, i)}
                onKeyDown={(event) => handleDesktopKeyDown(event, i)}
                onPaste={handleDesktopPaste}
                onFocus={(event) => event.target.select()}
                aria-label={`Digit ${i + 1}`}
                className={[
                  'h-10 w-10 rounded-xl border text-center font-mono text-base font-bold tabular-nums transition-all duration-200 sm:h-11 sm:w-11',
                  'bg-white/95 text-foreground caret-transparent shadow-[inset_0_1px_2px_rgb(var(--ink-rgb)/0.06)] outline-none dark:bg-background/85 dark:shadow-[inset_0_1px_0_rgb(var(--white-rgb)/0.04)]',
                  'focus:border-primary/60 focus:bg-primary/11 focus:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.14)] dark:focus:border-primary/60 dark:focus:bg-primary/8 dark:focus:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.14)]',
                  digit
                    ? 'auth-code-cell-filled border-primary/55 bg-primary/12 shadow-[0_14px_30px_-24px_rgb(var(--primary-rgb)/0.7),inset_0_1px_2px_rgb(var(--ink-rgb)/0.04)] dark:border-primary/45 dark:bg-primary/6 dark:shadow-[0_14px_30px_-24px_rgb(var(--primary-rgb)/0.9),inset_0_1px_0_rgb(var(--white-rgb)/0.44)]'
                    : 'border-foreground/20 hover:border-foreground/32 dark:border-foreground/12 dark:hover:border-foreground/24',
                ].join(' ')}
              />
            );
          })}
        </div>

        <span aria-hidden className="h-px w-3 rounded-full bg-foreground/25" />

        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 }, (_, i) => {
            const index = i + 4;
            const digit = value[index] ?? '';
            return (
              <input
                key={index}
                id={`otp-digit-${index + 1}`}
                ref={(el) => {
                  desktopInputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(event) => handleDesktopChange(event, index)}
                onKeyDown={(event) => handleDesktopKeyDown(event, index)}
                onPaste={handleDesktopPaste}
                onFocus={(event) => event.target.select()}
                aria-label={`Digit ${index + 1}`}
                className={[
                  'h-10 w-10 rounded-xl border text-center font-mono text-base font-bold tabular-nums transition-all duration-200 sm:h-11 sm:w-11',
                  'bg-white/95 text-foreground caret-transparent shadow-[inset_0_1px_2px_rgb(var(--ink-rgb)/0.06)] outline-none dark:bg-background/85 dark:shadow-[inset_0_1px_0_rgb(var(--white-rgb)/0.04)]',
                  'focus:border-primary/60 focus:bg-primary/11 focus:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.14)] dark:focus:border-primary/60 dark:focus:bg-primary/8 dark:focus:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.14)]',
                  digit
                    ? 'auth-code-cell-filled border-primary/55 bg-primary/12 shadow-[0_14px_30px_-24px_rgb(var(--primary-rgb)/0.7),inset_0_1px_2px_rgb(var(--ink-rgb)/0.04)] dark:border-primary/45 dark:bg-primary/6 dark:shadow-[0_14px_30px_-24px_rgb(var(--primary-rgb)/0.9),inset_0_1px_0_rgb(var(--white-rgb)/0.44)]'
                    : 'border-foreground/20 hover:border-foreground/32 dark:border-foreground/12 dark:hover:border-foreground/24',
                ].join(' ')}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
