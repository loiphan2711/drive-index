import type { SearchCategory } from '@/type/search-dialog';

import { SEARCH_CATEGORY_LOOKUP } from '@/constants/search';

type FilterTagProps = {
  active: boolean;
  category: SearchCategory;
  onToggle: (category: SearchCategory) => void;
};

export const FilterTag = ({ active, category, onToggle }: FilterTagProps) => {
  const meta = SEARCH_CATEGORY_LOOKUP[category];
  const Icon = meta.icon;

  return (
    <button
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
        active
          ? meta.color
          : 'border-(--cmdk-kbd-border) bg-(--cmdk-icon-bg) text-(--cmdk-text-muted) hover:border-(--cmdk-item-hover-border) hover:bg-(--cmdk-item-hover-bg) hover:text-(--cmdk-text)'
      }`}
      onClick={() => onToggle(category)}
      type="button"
    >
      <Icon aria-hidden className="size-3.5" />
      {category}
    </button>
  );
};
