'use client';

import type { ReactNode } from 'react';

import type { StatusTone } from '@/type/auth';
import { Alert, cn } from '@heroui/react';
import { CircleAlert, ShieldCheck, TriangleAlert } from 'lucide-react';

type StatusBannerProps = {
  children: ReactNode;
  tone: StatusTone;
  className?: string;
};

const toneConfig = {
  error: {
    status: 'danger' as const,
    style: 'border-danger bg-danger/10 text-danger',
    icon: CircleAlert,
    role: 'alert' as const,
    live: 'assertive' as const,
  },
  warning: {
    status: 'warning' as const,
    style: 'border-warning bg-warning/10 text-warning',
    icon: TriangleAlert,
    role: 'alert' as const,
    live: 'assertive' as const,
  },
  notice: {
    status: 'success' as const,
    style: 'border-accent-green bg-accent-green/10 text-accent-green',
    icon: ShieldCheck,
    role: 'status' as const,
    live: 'polite' as const,
  },
} satisfies Record<StatusTone, unknown>;

export const StatusBanner = ({
  children,
  tone,
  className,
}: StatusBannerProps) => {
  const config = toneConfig[tone];
  const Icon = config.icon;

  return (
    <Alert
      status={config.status}
      className={cn(
        'auth-banner gap-3 rounded-none border-2 px-4 py-3 shadow-pixel-sm',
        'text-xs leading-relaxed sm:text-sm',
        config.style,
        className,
      )}
      role={config.role}
      aria-live={config.live}
    >
      <Alert.Indicator className="mt-0.5 p-0">
        <Icon className="size-4 shrink-0" aria-hidden />
      </Alert.Indicator>
      <Alert.Content className="min-w-0">
        <Alert.Description className="text-inherit">
          {children}
        </Alert.Description>
      </Alert.Content>
    </Alert>
  );
};
