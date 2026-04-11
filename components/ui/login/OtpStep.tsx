'use client';

import type { FormEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button } from '@/components/common/Button';
import { OtpInput } from '@/components/common/OtpInput';
import { StatusBanner } from '@/components/common/StatusBanner';
import { useVerifyOtp } from '@/hooks/useAuth';
import { getSafeNextPath } from '@/utils/path';

type OtpStepProps = {
  email: string;
  otpLength: number;
  onBack: () => void;
};

export const OtpStep = ({ email, onBack, otpLength }: OtpStepProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { trigger: triggerVerifyOtp, isMutating: isVerifyingOtp } =
    useVerifyOtp();
  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get('next')),
    [searchParams],
  );

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.length < otpLength) {
      setOtpError(`Enter the full ${otpLength}-digit code.`);
      return;
    }

    setOtpError(null);

    try {
      await triggerVerifyOtp({ email, otp });
      router.push(nextPath);
      router.refresh();
    } catch (cause) {
      setOtpError(
        cause instanceof Error
          ? cause.message
          : 'Could not verify the code. Please try again.',
      );
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <p className="text-sm text-foreground/50">
        Code sent to{' '}
        <span className="font-semibold text-foreground/85">{email}</span>
      </p>

      <OtpInput autoFocusFirst value={otp} onChange={setOtp} />

      <p className="text-right text-[11px] tabular-nums text-foreground/35 sm:text-[12px]">
        {otp.length}/{otpLength}
      </p>

      {otpError && <StatusBanner tone="error">{otpError}</StatusBanner>}

      <Button
        type="submit"
        appearance="primary"
        fullWidth
        isDisabled={otp.length < otpLength}
        isLoading={isVerifyingOtp}
        loadingText="Verifying code"
      >
        <span>Verify code</span>
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </Button>

      <Button
        type="button"
        onPress={onBack}
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
  );
};
