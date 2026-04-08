import type { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div
        aria-hidden
        className="auth-login-grid pointer-events-none absolute inset-0"
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="auth-orb absolute -left-24 top-[18%] h-80 w-80 rounded-full bg-primary/28 blur-[110px] dark:bg-primary/18" />
        <div className="auth-orb auth-orb-delay absolute right-[6%] top-[10%] h-72 w-72 rounded-full bg-secondary/24 blur-[96px] dark:bg-secondary/16" />
        <div className="auth-orb absolute bottom-[2%] left-[18%] h-64 w-64 rounded-full bg-accent-green/16 blur-[90px] dark:bg-accent-green/10" />
      </div>

      <div className="relative z-10 w-full max-w-116">{children}</div>
    </main>
  );
}
