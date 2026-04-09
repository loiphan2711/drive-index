import type { ReactNode } from 'react';

type ShortcutKeyProps = {
  children: ReactNode;
  wide?: boolean;
};

export const ShortcutKey = ({ children, wide = false }: ShortcutKeyProps) => {
  return (
    <kbd
      className={`shadow-pixel-sm inline-flex h-7 items-center justify-center rounded-none border-2 border-(--cmdk-kbd-border) bg-(--cmdk-kbd-bg) px-2 text-[10px] font-normal uppercase tracking-[0.12em] text-(--cmdk-kbd-text) ${
        wide ? 'min-w-10' : 'min-w-7'
      }`}
    >
      {children}
    </kbd>
  );
};
