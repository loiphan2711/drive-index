'use client';

import type { FormEvent, ReactNode } from 'react';

import { Card, cn } from '@heroui/react';
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  LoaderCircle,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/common/Button';

import { OtpInput } from '@/components/common/OtpInput';

type AuthStep = 'email' | 'otp';

type AuthApiResponse = {
  error?: string;
};

type StatusTone = 'notice' | 'error';

const OTP_LENGTH = 8;

const getSafeNextPath = (candidate: string | null) => {
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) {
    return '/';
  }

  return candidate;
};

const getResponseError = async (response: Response) => {
  try {
    const data = (await response.json()) as AuthApiResponse;
    return data.error ?? 'Something went wrong. Please try again.';
  } catch {
    return 'Something went wrong. Please try again.';
  }
};

const CardShell = ({
  step,
  subtitle,
  children,
}: {
  step: AuthStep;
  subtitle: ReactNode;
  children: ReactNode;
}) => (
  <Card
    className={cn(
      'auth-panel relative overflow-hidden rounded-none border-2 border-foreground bg-background',
    )}
  >
    <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

    <Card.Header className="pb-3 pt-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-none border-2 border-foreground bg-background text-primary">
          {step === 'email' ? (
            <Mail className="size-4" aria-hidden />
          ) : (
            <ShieldCheck className="size-4" aria-hidden />
          )}
        </div>

        <div className="min-w-0">
          <h1 className="font-display text-xl tracking-wide uppercase">
            Drive Index
          </h1>
          <p className="text-xs text-foreground/50">{subtitle}</p>
        </div>
      </div>
    </Card.Header>

    <Card.Content className="pb-5 pt-0">
      <div key={step} className="auth-stage">
        {children}
      </div>
    </Card.Content>
  </Card>
);

const StatusBanner = ({
  children,
  tone,
}: {
  children: ReactNode;
  tone: StatusTone;
}) => {
  const isError = tone === 'error';

  return (
    <div
      className={cn(
        'auth-banner shadow-pixel-sm flex items-start gap-3 rounded-none border-2 px-4 py-3 text-[12.5px] leading-relaxed',
        isError
          ? 'border-danger bg-danger/10 text-danger'
          : 'border-accent-green bg-accent-green/10 text-accent-green',
      )}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      {isError ? (
        <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      ) : (
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
      )}
      <p className="min-w-0">{children}</p>
    </div>
  );
};

const LoginPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailInputRef = useRef<HTMLInputElement | null>(null);
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (step === 'email') {
      emailInputRef.current?.focus();
    }
  }, [step]);

  const handleSendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Email is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!response.ok) {
        setError(await getResponseError(response));
        return;
      }

      setEmail(normalizedEmail);
      setOtp('');
      setStep('otp');
      setNotice(`Verification code sent to ${normalizedEmail}.`);
    } catch {
      setError('Could not send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.length < OTP_LENGTH) {
      setError('Enter the full 8-digit code.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        setError(await getResponseError(response));
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError('Could not verify the code. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      ? 'Sign in with your work email'
      : `Enter the code sent to ${email}`;

  return (
    <CardShell step={step} subtitle={subtitle}>
      {step === 'email' ? (
        <form className="space-y-4" onSubmit={handleSendOtp}>
          <label
            htmlFor="email"
            className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/45"
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
              className="flex-1 border-0 bg-transparent p-0 text-sm text-foreground outline-none placeholder:text-foreground/28"
            />
          </div>

          {notice && <StatusBanner tone="notice">{notice}</StatusBanner>}
          {error && <StatusBanner tone="error">{error}</StatusBanner>}

          <Button
            type="submit"
            appearance="primary"
            fullWidth
            isDisabled={isSubmitting}
          >
            {isSubmitting ? (
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
          <p className="text-xs text-foreground/50">
            Code sent to{' '}
            <span className="font-semibold text-foreground/85">{email}</span>
          </p>

          <OtpInput autoFocusFirst value={otp} onChange={setOtp} />

          <p className="text-right text-[10px] tabular-nums text-foreground/35">
            {otp.length}/{OTP_LENGTH}
          </p>

          {notice && <StatusBanner tone="notice">{notice}</StatusBanner>}
          {error && <StatusBanner tone="error">{error}</StatusBanner>}

          <Button
            type="submit"
            appearance="primary"
            fullWidth
            isDisabled={isSubmitting || otp.length < OTP_LENGTH}
          >
            {isSubmitting ? (
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
            isDisabled={isSubmitting}
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

const LoginPageFallback = () => (
  <Card
    className={cn(
      'auth-panel relative overflow-hidden rounded-none border-2 border-foreground bg-background',
    )}
  >
    <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

    <Card.Header className="pb-3 pt-5">
      <div className="flex items-center gap-3">
        <div className="size-9 animate-pulse rounded-none bg-foreground/10" />
        <div className="space-y-2">
          <div className="h-6 w-28 animate-pulse rounded-none bg-foreground/10" />
          <div className="h-3 w-44 animate-pulse rounded-none bg-foreground/8" />
        </div>
      </div>
    </Card.Header>

    <Card.Content className="space-y-4 pb-5 pt-0">
      <div className="space-y-2">
        <div className="h-3 w-20 animate-pulse rounded-none bg-foreground/8" />
        <div className="h-11 w-full animate-pulse rounded-none bg-foreground/10" />
      </div>
      <div className="h-12 w-full animate-pulse rounded-none bg-foreground/8" />
    </Card.Content>
  </Card>
);

const LoginPage = () => (
  <Suspense fallback={<LoginPageFallback />}>
    <LoginPageContent />
  </Suspense>
);

export default LoginPage;
