'use client';

import type { SyntheticEvent } from 'react';

import { ArrowRight, Mail } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { StatusBanner } from '@/components/common/StatusBanner';

type EmailStepProps = {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
  isSending: boolean;
  error: string | null;
};

export const EmailStep = ({
  email,
  error,
  isSending,
  onEmailChange,
  onSubmit,
}: EmailStepProps) => {
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Label htmlFor="email">Work email</Label>

      <Input
        id="email"
        ref={emailInputRef}
        name="email"
        type="email"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect="off"
        enterKeyHint="go"
        placeholder="you@company.com"
        spellCheck={false}
        startContent={<Mail className="size-4" aria-hidden />}
      />

      {error && <StatusBanner tone="error">{error}</StatusBanner>}

      <Button
        type="submit"
        appearance="primary"
        fullWidth
        isLoading={isSending}
        loadingText="Sending code"
      >
        <span>Send verification code</span>
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </Button>
    </form>
  );
};
