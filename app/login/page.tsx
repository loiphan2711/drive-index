'use client';

import type { FormEvent, ReactNode } from 'react';

import { Button, Card } from '@heroui/react';
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

import { OtpInput } from './OtpInput';

type AuthStep = 'email' | 'otp';

type AuthApiResponse = {
  error?: string;
};

type StatusTone = 'notice' | 'error';

const OTP_LENGTH = 8;

const PRIMARY_BUTTON_CLASS_NAME =
  'group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-[1.15rem] bg-[linear-gradient(135deg,var(--primary)_0%,var(--secondary)_100%)] px-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_24px_40px_-24px_rgb(var(--primary-rgb)/0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_50px_-24px_rgb(var(--primary-rgb)/0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70';
const SECONDARY_BUTTON_CLASS_NAME =
  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-[1.05rem] border border-foreground/20 bg-white/85 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/70 transition-all duration-200 hover:border-foreground/30 hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 dark:border-foreground/12 dark:bg-background/72 dark:hover:border-foreground/22 dark:hover:bg-foreground/4';

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
  <Card className="auth-panel relative overflow-hidden border border-foreground/18 bg-[linear-gradient(180deg,rgb(var(--white-rgb)/0.97),rgb(var(--white-rgb)/0.88))] shadow-[0_4px_24px_-2px_rgb(var(--ink-rgb)/0.10),0_48px_80px_-40px_rgb(var(--ink-rgb)/0.18)] backdrop-blur-xl dark:border-foreground/12 dark:bg-[linear-gradient(180deg,rgb(var(--ink-rgb)/0.96),rgb(var(--ink-rgb)/0.88))] dark:shadow-[0_48px_120px_-52px_rgb(var(--ink-rgb)/0.6)]">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
    <div
      aria-hidden
      className="pointer-events-none absolute -left-8 top-12 h-24 w-24 rounded-full bg-primary/12 blur-3xl"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -right-10 top-8 h-28 w-28 rounded-full bg-secondary/12 blur-[72px]"
    />

    <Card.Header className="pb-3 pt-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-foreground/18 bg-white/90 text-primary shadow-[inset_0_1px_2px_rgb(var(--ink-rgb)/0.06)] dark:border-foreground/12 dark:bg-background/75 dark:shadow-[inset_0_1px_0_rgb(var(--white-rgb)/0.05)]">
          {step === 'email' ? (
            <Mail className="size-4" aria-hidden />
          ) : (
            <ShieldCheck className="size-4" aria-hidden />
          )}
        </div>

        <div className="min-w-0">
          <h1 className="font-display text-2xl tracking-wide uppercase">
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
      className={[
        'auth-banner flex items-start gap-3 rounded-[1.25rem] border px-4 py-3 text-[12.5px] leading-relaxed shadow-[0_16px_40px_-30px_rgb(var(--ink-rgb)/0.35)]',
        isError
          ? 'border-red-500/45 bg-red-500/14 text-red-700 dark:border-red-500/28 dark:bg-red-500/8 dark:text-red-300'
          : 'border-secondary/40 bg-secondary/12 text-foreground/80 dark:border-secondary/24 dark:bg-secondary/8 dark:text-foreground/72',
      ].join(' ')}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      {isError ? (
        <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      ) : (
        <ShieldCheck
          className="mt-0.5 size-4 shrink-0 text-secondary"
          aria-hidden
        />
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

          <div className="group flex items-center gap-2.5 rounded-xl border border-foreground/20 bg-white/95 px-3.5 py-2.5 shadow-[inset_0_1px_2px_rgb(var(--ink-rgb)/0.06)] transition-all duration-200 hover:border-foreground/30 focus-within:border-primary/55 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.12),inset_0_1px_2px_rgb(var(--ink-rgb)/0.04)] dark:border-foreground/12 dark:bg-background/80 dark:shadow-none dark:hover:border-foreground/22 dark:focus-within:border-primary/45 dark:focus-within:bg-background dark:focus-within:shadow-[0_0_0_4px_rgb(var(--primary-rgb)/0.12)]">
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
            className={PRIMARY_BUTTON_CLASS_NAME}
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

          <button
            type="submit"
            className={PRIMARY_BUTTON_CLASS_NAME}
            disabled={isSubmitting || otp.length < OTP_LENGTH}
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
          </button>

          <button
            type="button"
            onClick={goBackToEmailStep}
            className={SECONDARY_BUTTON_CLASS_NAME}
            disabled={isSubmitting}
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Use a different email
            </span>
          </button>
        </form>
      )}
    </CardShell>
  );
};

const LoginPageFallback = () => (
  <Card className="auth-panel relative overflow-hidden border border-foreground/18 bg-[linear-gradient(180deg,rgb(var(--white-rgb)/0.97),rgb(var(--white-rgb)/0.88))] shadow-[0_4px_24px_-2px_rgb(var(--ink-rgb)/0.10),0_48px_80px_-40px_rgb(var(--ink-rgb)/0.18)] backdrop-blur-xl dark:border-foreground/12 dark:bg-[linear-gradient(180deg,rgb(var(--ink-rgb)/0.96),rgb(var(--ink-rgb)/0.88))] dark:shadow-[0_48px_120px_-52px_rgb(var(--ink-rgb)/0.6)]">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

    <Card.Header className="pb-3 pt-5">
      <div className="flex items-center gap-3">
        <div className="size-9 animate-pulse rounded-xl bg-foreground/10" />
        <div className="space-y-2">
          <div className="h-6 w-28 animate-pulse rounded-full bg-foreground/10" />
          <div className="h-3 w-44 animate-pulse rounded-full bg-foreground/8" />
        </div>
      </div>
    </Card.Header>

    <Card.Content className="space-y-4 pb-5 pt-0">
      <div className="space-y-2">
        <div className="h-3 w-20 animate-pulse rounded-full bg-foreground/8" />
        <div className="h-11 w-full animate-pulse rounded-xl bg-foreground/10" />
      </div>
      <div className="h-12 w-full animate-pulse rounded-[1.1rem] bg-foreground/8" />
    </Card.Content>
  </Card>
);

const LoginPage = () => (
  <Suspense fallback={<LoginPageFallback />}>
    <LoginPageContent />
  </Suspense>
);

export default LoginPage;
