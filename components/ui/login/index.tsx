'use client';

import type { SyntheticEvent } from 'react';
import type { AuthStep } from '@/type/auth';

import { cn } from '@heroui/react';

import { ArrowLeft, ArrowRight, LoaderCircle, Mail } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/common/Button';
import { OtpInput } from '@/components/common/OtpInput';
import { StatusBanner } from '@/components/common/StatusBanner';
import { useSendOtp, useVerifyOtp } from '@/hooks/useAuth';
import { getSafeNextPath } from '@/utils/path';
import { CardShell } from './CardShell';

const OTP_LENGTH = 8;

export const LoginPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const { trigger: triggerSendOtp, isMutating: isSendingOtp } = useSendOtp();
  const { trigger: triggerVerifyOtp, isMutating: isVerifyingOtp } =
    useVerifyOtp();
  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get('next')),
    [searchParams],
  );

  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'auth_failed'
      ? 'Authentication failed. Request a new verification code.'
      : null,
  );

  useEffect(() => {
    if (step === 'email') {
      emailInputRef.current?.focus();
    }
  }, [step]);

  const handleSendOtp = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Email is required.');
      return;
    }

    setError(null);
    setNotice(null);

    try {
      await triggerSendOtp({ email: normalizedEmail });
      setEmail(normalizedEmail);
      setOtp('');
      setStep('otp');
      setNotice(`Verification code sent to ${normalizedEmail}.`);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Could not send verification code. Please try again.',
      );
    }
  };

  const handleVerifyOtp = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.length < OTP_LENGTH) {
      setError(`Enter the full ${OTP_LENGTH}-digit code.`);
      return;
    }

    setError(null);

    try {
      await triggerVerifyOtp({ email, otp });

      router.push(nextPath);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Could not verify the code. Please try again.',
      );
    }
  };

  const goBackToEmailStep = () => {
    setStep('email');
    setOtp('');
    setError(null);
    setNotice(null);
  };

  const subtitle =
    step === 'email'
      ? 'Sign in with your email'
      : `Enter the code sent to ${email}`;

  return (
    <CardShell step={step} subtitle={subtitle}>
      {step === 'email' ? (
        <form className="space-y-4" onSubmit={handleSendOtp}>
          <label
            htmlFor="email"
            className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/45 sm:text-[12px]"
          >
            Work email
          </label>

          <div
            className={cn(
              'group flex items-center gap-2.5 rounded-none border-2 px-3.5 py-2.5 transition-[border-color,box-shadow] duration-100',
              'border-foreground/40 bg-background hover:border-foreground',
              'focus-within:border-primary focus-within:shadow-[2px_2px_0px_var(--primary)]',
            )}
          >
            <Mail
              className="size-4 shrink-0 text-foreground/45 transition-colors duration-200 group-focus-within:text-primary"
              aria-hidden
            />
            <input
              id="email"
              ref={emailInputRef}
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              enterKeyHint="go"
              placeholder="you@company.com"
              spellCheck={false}
              className="flex-1 border-0 bg-transparent p-0 text-sm text-foreground outline-none placeholder:text-foreground/28 sm:text-base"
            />
          </div>

          {notice && <StatusBanner tone="notice">{notice}</StatusBanner>}
          {error && <StatusBanner tone="error">{error}</StatusBanner>}

          <Button
            type="submit"
            appearance="primary"
            fullWidth
            isDisabled={isSendingOtp}
          >
            {isSendingOtp ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin" />
                Sending code
              </span>
            ) : (
              <>
                <span>Send verification code</span>
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </>
            )}
          </Button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleVerifyOtp}>
          <p className="text-sm text-foreground/50">
            Code sent to{' '}
            <span className="font-semibold text-foreground/85">{email}</span>
          </p>

          <OtpInput autoFocusFirst value={otp} onChange={setOtp} />

          <p className="text-right text-[11px] tabular-nums text-foreground/35 sm:text-[12px]">
            {otp.length}/{OTP_LENGTH}
          </p>

          {notice && <StatusBanner tone="notice">{notice}</StatusBanner>}
          {error && <StatusBanner tone="error">{error}</StatusBanner>}

          <Button
            type="submit"
            appearance="primary"
            fullWidth
            isDisabled={isVerifyingOtp || otp.length < OTP_LENGTH}
          >
            {isVerifyingOtp ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin" />
                Verifying code
              </span>
            ) : (
              <>
                <span>Verify code</span>
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </>
            )}
          </Button>

          <Button
            type="button"
            onPress={goBackToEmailStep}
            appearance="secondary"
            fullWidth
            isDisabled={isVerifyingOtp}
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Use a different email
            </span>
          </Button>
        </form>
      )}
    </CardShell>
  );
};
