'use client';

import type { SyntheticEvent } from 'react';
import type { AuthStep } from '@/type/auth';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useSendOtp } from '@/hooks/useAuth';

import { CardShell } from './CardShell';
import { EmailStep } from './EmailStep';
import { OtpStep } from './OtpStep';

const OTP_LENGTH = 8;

export const LoginPageContent = () => {
  const searchParams = useSearchParams();
  const { trigger: triggerSendOtp, isMutating: isSendingOtp } = useSendOtp();

  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(
    searchParams.get('error') === 'auth_failed'
      ? 'Authentication failed. Request a new verification code.'
      : null,
  );

  const handleSendOtp = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setEmailError('Email is required.');
      return;
    }

    setEmailError(null);

    try {
      await triggerSendOtp({ email: normalizedEmail });
      setEmail(normalizedEmail);
      setStep('otp');
      toast.success(`Verification code sent to ${normalizedEmail}.`);
    } catch (cause) {
      setEmailError(
        cause instanceof Error
          ? cause.message
          : 'Could not send verification code. Please try again.',
      );
    }
  };

  const goBackToEmailStep = () => {
    setStep('email');
    setEmailError(null);
  };

  const subtitle =
    step === 'email'
      ? 'Sign in with your email'
      : `Enter the code sent to ${email}`;

  return (
    <CardShell step={step} subtitle={subtitle}>
      {step === 'email' ? (
        <EmailStep
          email={email}
          onEmailChange={setEmail}
          onSubmit={handleSendOtp}
          isSending={isSendingOtp}
          error={emailError}
        />
      ) : (
        <OtpStep
          email={email}
          otpLength={OTP_LENGTH}
          onBack={goBackToEmailStep}
        />
      )}
    </CardShell>
  );
};
