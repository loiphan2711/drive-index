'use client';

import type { ReactNode } from 'react';

import type { StatusTone } from '@/type/auth';
import { cn } from '@heroui/react';
import { CircleAlert, ShieldCheck } from 'lucide-react';

type StatusBannerProps = {
  children: ReactNode;
  tone: StatusTone;
};

export const StatusBanner = ({ children, tone }: StatusBannerProps) => {
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
