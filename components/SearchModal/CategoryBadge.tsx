import type { SearchCategory } from '@/type/search-dialog';

import { SEARCH_CATEGORY_LOOKUP } from '@/constants/search';

export const CategoryBadge = ({ category }: { category: SearchCategory }) => {
  const meta = SEARCH_CATEGORY_LOOKUP[category];
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${meta.color}`}
    >
      <Icon aria-hidden className="size-3" />
      {category}
    </span>
  );
};
