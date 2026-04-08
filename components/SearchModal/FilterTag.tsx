import type { SearchCategory } from '@/type/search-dialog';

import { Button } from '@/components/ui/Button';
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
    <Button
      appearance="filter"
      aria-pressed={active}
      className={active ? meta.color : undefined}
      onPress={() => onToggle(category)}
      type="button"
    >
      <Icon aria-hidden className="size-3.5" />
      {category}
    </Button>
  );
};
