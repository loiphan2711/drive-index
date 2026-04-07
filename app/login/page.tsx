'use client';

import type { FormEvent } from 'react';

import { Button, Card, Input } from '@heroui/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

type AuthStep = 'email' | 'otp';

type AuthApiResponse = {
  error?: string;
};

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

const LoginPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
        headers: {
          'Content-Type': 'application/json',
        },
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

    const verificationCode = otp.trim();
    if (!verificationCode) {
      setError('Verification code is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: verificationCode,
        }),
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

  return (
    <Card className="border border-foreground/10 bg-background/95 shadow-[0_32px_80px_-56px_rgba(28,32,43,0.75)] backdrop-blur-sm">
      <Card.Header className="space-y-2 border-b border-foreground/10 pb-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-foreground/45">
          Restricted Workspace
        </p>
        <Card.Title className="font-display text-4xl tracking-wide uppercase">
          Drive Index
        </Card.Title>
        <Card.Description className="text-sm leading-6 text-foreground/65">
          {step === 'email'
            ? 'Sign in with an approved email address to continue.'
            : `Enter the one-time code sent to ${email}.`}
        </Card.Description>
      </Card.Header>

      <Card.Content className="pt-6">
        {step === 'email' ? (
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/55"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="you@company.com"
                variant="secondary"
                fullWidth
              />
            </div>

            {notice && (
              <p className="rounded-lg border border-[#3f6cff]/28 bg-[#3f6cff]/10 px-3 py-2 text-sm text-foreground/75">
                {notice}
              </p>
            )}

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isDisabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send verification code'
              )}
            </Button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/55"
              >
                Verification Code
              </label>
              <Input
                id="otp"
                name="otp"
                inputMode="numeric"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="Enter the code from your email"
                variant="secondary"
                fullWidth
              />
            </div>

            {notice && (
              <p className="rounded-lg border border-[#3f6cff]/28 bg-[#3f6cff]/10 px-3 py-2 text-sm text-foreground/75">
                {notice}
              </p>
            )}

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isDisabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify code'
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onPress={goBackToEmailStep}
              className="w-full"
              isDisabled={isSubmitting}
            >
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="size-4" />
                Use a different email
              </span>
            </Button>
          </form>
        )}
      </Card.Content>
    </Card>
  );
};

const LoginPageFallback = () => {
  return (
    <Card className="border border-foreground/10 bg-background/95 shadow-[0_32px_80px_-56px_rgba(28,32,43,0.75)] backdrop-blur-sm">
      <Card.Header className="space-y-2 border-b border-foreground/10 pb-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-foreground/45">
          Restricted Workspace
        </p>
        <Card.Title className="font-display text-4xl tracking-wide uppercase">
          Drive Index
        </Card.Title>
        <Card.Description className="text-sm leading-6 text-foreground/65">
          Preparing sign-in...
        </Card.Description>
      </Card.Header>
      <Card.Content className="pt-6">
        <p className="text-sm text-foreground/65">Loading login form...</p>
      </Card.Content>
    </Card>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
};

export default LoginPage;
