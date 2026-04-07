import type { SearchCategory } from '@/type/search-dialog';

import { SEARCH_CATEGORY_LOOKUP } from '@/constants/search';

export const CategoryBadge = ({ category }: { category: SearchCategory }) => {
  const meta = SEARCH_CATEGORY_LOOKUP[category];
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border p-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] sm:gap-1.5 sm:px-2.5 sm:py-1 ${meta.color}`}
    >
      <Icon aria-hidden className="size-3" />
      <span className="hidden sm:inline">{category}</span>
    </span>
  );
};
