'use client';

import { LoaderCircle, Plug2, RotateCcw, Unplug } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button, buttonVariants } from '@/components/common/Button';
import { StatusBanner } from '@/components/common/StatusBanner';
import { PAGE_PATHS } from '@/constants/path';
import { useGoogleConnection } from '@/hooks/useGoogleConnection';
import { FetchError } from '@/lib/swr/fetcher';
import { disconnectGoogle } from '@/services/google';

const getConnectionLabel = (
  connected: boolean | undefined,
  isLoading: boolean,
) => {
  if (isLoading) {
    return 'Checking';
  }

  return connected ? 'Connected' : 'Disconnected';
};

export const ConnectionCard = () => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const {
    data: connection,
    error: connectionError,
    isLoading,
    mutate,
  } = useGoogleConnection();
  const isUnauthorized =
    connectionError instanceof FetchError && connectionError.status === 401;
  const isConnected = Boolean(connection?.connected);

  const handleDisconnect = async () => {
    setIsDisconnecting(true);

    try {
      await disconnectGoogle();
      await mutate({ connected: false }, { revalidate: false });
      toast.success('Google Drive disconnected.');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not disconnect Google Drive.',
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <section className="shadow-pixel relative overflow-hidden border-2 border-foreground bg-background">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(var(--primary-rgb)/0.08)_0%,transparent_42%,rgba(var(--secondary-rgb)/0.14)_100%)]" />

      <div className="relative flex h-full flex-col gap-6 px-5 py-6 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 border-2 border-foreground/20 bg-background px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-primary">
              <Plug2 aria-hidden className="size-3.5" />
              Google Drive
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-lg uppercase text-foreground sm:text-xl">
                  Connection Center
                </h2>
                <span
                  className={`border-2 px-2 py-1 text-[11px] uppercase tracking-[0.12em] sm:text-[12px] ${isConnected ? 'border-accent-green/30 text-accent-green' : 'border-foreground/20 text-foreground/40'}`}
                >
                  {getConnectionLabel(isConnected, isLoading)}
                </span>
              </div>

              <p className="max-w-xl text-sm leading-6 text-foreground/60">
                {isConnected
                  ? 'OAuth tokens are available for this account. Reconnect if you want to refresh consent or disconnect to remove access.'
                  : 'Connect Google Drive before browsing folders or configuring dashboard root folders.'}
              </p>
            </div>
          </div>

          <div className="hidden size-12 items-center justify-center border-2 border-foreground/20 bg-background/80 text-primary sm:flex">
            {isLoading || isDisconnecting ? (
              <LoaderCircle aria-hidden className="size-5 animate-spin" />
            ) : isConnected ? (
              <RotateCcw aria-hidden className="size-5" />
            ) : (
              <Unplug aria-hidden className="size-5" />
            )}
          </div>
        </div>

        {connectionError && !isUnauthorized ? (
          <StatusBanner tone="error">{connectionError.message}</StatusBanner>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          {isLoading ? (
            <div className="inline-flex items-center gap-2 border-2 border-foreground/25 bg-background px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-foreground/55 sm:text-[12px]">
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
              Checking status
            </div>
          ) : isConnected ? (
            <>
              <Link
                className={buttonVariants({ appearance: 'secondary' })}
                href={PAGE_PATHS.googleAuth}
              >
                Reconnect
              </Link>
              <Button
                appearance="secondary"
                isLoading={isDisconnecting}
                loadingText="Disconnecting"
                onPress={handleDisconnect}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <Link
              className={buttonVariants({ appearance: 'primary' })}
              href={PAGE_PATHS.googleAuth}
            >
              Connect Google Drive
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
