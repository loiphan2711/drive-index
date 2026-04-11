import Link from 'next/link';
import { redirect } from 'next/navigation';

import { buttonVariants } from '@/components/common/Button';
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
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="shadow-pixel flex w-full max-w-2xl flex-col gap-8 border-dotted-2 border-foreground bg-background p-8">
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <p className="font-display text-[11px] uppercase tracking-[0.22em] text-primary sm:text-[12px]">
            Stage Clear
          </p>
          <h1 className="font-display text-2xl leading-tight uppercase text-foreground sm:text-3xl">
            Welcome Back
          </h1>
          <p className="max-w-xl text-sm leading-6 text-foreground/65 sm:text-base">
            Your account is authenticated and ready. Use this dashboard as the
            safe landing zone after login.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="shadow-pixel-sm flex flex-col gap-4 border-dotted-2 border-foreground/50 bg-background px-5 py-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/45 sm:text-[12px]">
                Current Player
              </p>
              <span className="border-2 border-foreground/30 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-accent-green sm:text-[12px]">
                Online
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-display text-lg leading-snug uppercase text-foreground sm:text-xl">
                {displayName}
              </p>
              <p className="break-all text-sm text-foreground/65 sm:text-base">
                {user.email ?? 'No email available'}
              </p>
            </div>

            <p className="text-sm leading-6 text-foreground/55">
              Access to this route is gated by middleware and rechecked on the
              server, so public pages stay open while account-only pages remain
              protected.
            </p>
          </section>

          <section className="flex flex-col items-center justify-center gap-4 border-2 border-foreground bg-primary/6 px-5 py-6 text-center">
            <svg
              aria-hidden
              className="size-20 text-secondary"
              fill="currentColor"
              viewBox="0 0 28 35"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14 0C6.268 0 0 6.268 0 14v21l4-3 4 3 4-3 4 3 4-3 4 3 4-3V14C28 6.268 21.732 0 14 0zm-5 15a2 2 0 110-4 2 2 0 010 4zm10 0a2 2 0 110-4 2 2 0 010 4z" />
            </svg>

            <div className="flex flex-col gap-2">
              <p className="font-display text-sm uppercase text-foreground sm:text-base">
                Bonus Round Unlocked
              </p>
              <p className="text-sm leading-6 text-foreground/55">
                Jump back into the public file index or stay here as your
                authenticated starting point.
              </p>
            </div>

            <Link
              className={buttonVariants({ appearance: 'primary' })}
              href="/file/0/"
            >
              Open File Index
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
