export const CountBadge = ({ value }: { value: number }) => {
  return (
    <span className="shadow-pixel-sm inline-flex min-w-7 items-center justify-center rounded-none border-2 border-(--cmdk-kbd-border) bg-(--cmdk-icon-bg) px-2 py-1 text-[11px] font-semibold text-(--cmdk-kbd-text)">
      {value}
    </span>
  );
};
