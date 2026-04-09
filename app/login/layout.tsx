import type { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div
        aria-hidden
        className="auth-login-grid pointer-events-none absolute inset-0"
      />
      <div aria-hidden className="auth-pacman-login" />

      <div className="relative z-10 w-full max-w-116">{children}</div>
    </main>
  );
}
