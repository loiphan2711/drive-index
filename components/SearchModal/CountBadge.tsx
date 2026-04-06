export const CountBadge = ({ value }: { value: number }) => {
  return (
    <span className="inline-flex min-w-7 items-center justify-center rounded-full border border-(--cmdk-kbd-border) bg-(--cmdk-icon-bg) px-2 py-1 text-[11px] font-semibold text-(--cmdk-kbd-text)">
      {value}
    </span>
  );
};
