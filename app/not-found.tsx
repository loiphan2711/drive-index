import { cn } from '@heroui/styles';

import Link from 'next/link';
import { buttonVariants } from '@/components/common/Button';

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-md flex-col items-center gap-8 border-dotted-2 border-foreground bg-background p-8 text-center shadow-pixel">
        <p className="font-display text-[10px] uppercase tracking-[0.22em] text-primary">
          Game Over
        </p>

        <div className="font-display text-6xl leading-none text-foreground">
          404
        </div>

        <svg
          aria-hidden
          className="size-16 text-secondary"
          fill="currentColor"
          viewBox="0 0 28 35"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14 0C6.268 0 0 6.268 0 14v21l4-3 4 3 4-3 4 3 4-3 4 3 4-3V14C28 6.268 21.732 0 14 0zm-5 15a2 2 0 110-4 2 2 0 010 4zm10 0a2 2 0 110-4 2 2 0 010 4z" />
        </svg>

        <div className="flex flex-col gap-2">
          <p className="font-display text-sm uppercase text-foreground">
            Ghost Ate Your Page
          </p>
          <p className="font-mono text-xs text-foreground/55">
            The path you entered does not exist.
            <br />
            Insert coin to continue.
          </p>
        </div>

        <Link
          className={cn(
            buttonVariants({ appearance: 'primary' }),
            'flex flex-col justify-center',
          )}
          href="/file/0/"
        >
          <span className="mb-0.5">Go Home</span>
        </Link>
      </div>
    </div>
  );
}
