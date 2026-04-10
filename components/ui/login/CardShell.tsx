'use client';

import type { ReactNode } from 'react';
import type { AuthStep } from '@/type/auth';
import { Card, cn } from '@heroui/react';
import { Mail, ShieldCheck } from 'lucide-react';

type CardShellProps = {
  step: AuthStep;
  subtitle: ReactNode;
  children: ReactNode;
};

export const CardShell = ({ step, subtitle, children }: CardShellProps) => (
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
          <h1 className="font-display text-xl tracking-wide uppercase sm:text-2xl">
            Drive Index
          </h1>
          <p className="text-sm text-foreground/50">{subtitle}</p>
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
