import type { LucideIcon } from 'lucide-react';

export type SearchCategory =
  | 'Workflows'
  | 'Teams'
  | 'Documents'
  | 'Tasks'
  | 'Projects';

export type SearchCategoryDefinition = {
  color: string;
  icon: LucideIcon;
  key: SearchCategory;
};

export type SearchRecentItem = {
  category: SearchCategory;
  detail: string;
  icon: LucideIcon;
  id: string;
  label: string;
};

export type SearchQuickAction = {
  count?: number;
  description: string;
  icon: LucideIcon;
  id: string;
  label: string;
};

export type SearchResult = {
  category: SearchCategory;
  filename: string;
  id: string;
  keywords: string[];
};

export type KeyboardShortcut = {
  key: string;
  label: string;
};
