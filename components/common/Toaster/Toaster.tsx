'use client';

import { cn } from '@heroui/react';
import { CircleAlert, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as SonnerToaster } from 'sonner';

const toastClassName = cn(
  'flex w-[22rem] max-w-[calc(100vw-2rem)] items-start gap-3',
  'rounded-none border-2 border-(--toast-border) bg-(--toast-bg) px-4 py-3',
  'font-sans text-(--toast-text) text-xs shadow-pixel-sm sm:text-sm',
);

export const Toaster = () => {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      position="top-right"
      duration={5000}
      mobileOffset={{ top: 16, right: 16, left: 16 }}
      offset={{ top: 24, right: 24 }}
      icons={{
        success: <ShieldCheck className="size-4" aria-hidden />,
        error: <CircleAlert className="size-4" aria-hidden />,
        warning: <TriangleAlert className="size-4" aria-hidden />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: toastClassName,
          content: 'grid min-w-0 gap-1',
          icon: 'mt-0.5 shrink-0',
          title: 'text-inherit leading-relaxed font-medium',
          description: 'text-inherit/80 leading-relaxed',
          success:
            'border-(--toast-success-border) bg-(--toast-success-bg) text-(--toast-success-text)',
          error:
            'border-(--toast-error-border) bg-(--toast-error-bg) text-(--toast-error-text)',
          warning:
            'border-(--toast-warning-border) bg-(--toast-warning-bg) text-(--toast-warning-text)',
        },
      }}
    />
  );
};
