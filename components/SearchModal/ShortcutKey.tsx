import type { ReactNode } from 'react';

type ShortcutKeyProps = {
  children: ReactNode;
  wide?: boolean;
};

export const ShortcutKey = ({ children, wide = false }: ShortcutKeyProps) => {
  return (
    <kbd
      className={`inline-flex h-7 items-center justify-center rounded-lg border border-(--cmdk-kbd-border) bg-(--cmdk-kbd-bg) px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--cmdk-kbd-text) shadow-[inset_0_1px_0_var(--cmdk-kbd-inset)] ${
        wide ? 'min-w-10' : 'min-w-7'
      }`}
    >
      {children}
    </kbd>
  );
};
