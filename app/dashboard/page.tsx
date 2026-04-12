import Link from 'next/link';
import { redirect } from 'next/navigation';

import { buttonVariants } from '@/components/common/Button';
import { DashboardConfig } from '@/components/ui/dashboard';
import { PAGE_PATHS } from '@/constants/path';
import { createClient } from '@/lib/supabase/server';
import { getDisplayName } from '@/utils/user';

export const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`${PAGE_PATHS.login}?next=${PAGE_PATHS.dashboard}`);
  }

  const displayName = getDisplayName(user.user_metadata ?? {}, user.email);

  return (
    <div className="flex flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="shadow-pixel relative overflow-hidden border-2 border-foreground bg-background">
          <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(var(--primary-rgb)/0.08)_0%,transparent_45%,rgba(var(--secondary-rgb)/0.22)_100%)]" />

          <div className="relative grid gap-6 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div className="space-y-4">
              <p className="font-display text-[11px] uppercase tracking-[0.22em] text-primary sm:text-[12px]">
                Config
              </p>
              <div className="space-y-3">
                <h1 className="font-display text-3xl leading-tight uppercase text-foreground sm:text-4xl">
                  Dashboard
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-foreground/60 sm:text-base">
                  Manage the Google Drive connection and the root folders that
                  appear as entry points inside the file index.
                </p>
              </div>
            </div>

            <section className="shadow-pixel-sm flex flex-col gap-4 border-dotted-2 border-foreground/40 bg-background/90 px-5 py-5 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/45 sm:text-[12px]">
                  Current Player
                </p>
                <span className="border-2 border-accent-green/30 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-accent-green sm:text-[12px]">
                  Online
                </span>
              </div>

              <div className="space-y-2">
                <p className="font-display text-lg uppercase text-foreground sm:text-xl">
                  {displayName}
                </p>
                <p className="break-all text-sm text-foreground/60 sm:text-base">
                  {user.email ?? 'No email available'}
                </p>
              </div>

              <p className="text-sm leading-6 text-foreground/55">
                Server auth stays enforced here, while the Drive controls below
                handle OAuth status and folder configuration for this account.
              </p>

              <div className="pt-1">
                <Link
                  className={buttonVariants({ appearance: 'secondary' })}
                  href={PAGE_PATHS.fileIndex}
                >
                  Open File Index
                </Link>
              </div>
            </section>
          </div>
        </section>

        <DashboardConfig />
      </div>
    </div>
  );
};

export default DashboardPage;
