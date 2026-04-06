import type { LucideIcon } from 'lucide-react';

import {
  AlarmClock,
  Bell,
  CirclePlus,
  FileText,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  MessageSquareText,
  ScanSearch,
  Users2,
  Workflow,
} from 'lucide-react';

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

export const SEARCH_CATEGORIES: SearchCategoryDefinition[] = [
  {
    color:
      'border-amber-500/25 bg-amber-500/12 text-amber-700 dark:border-amber-300/30 dark:bg-amber-300/14 dark:text-amber-100',
    icon: Workflow,
    key: 'Workflows',
  },
  {
    color:
      'border-sky-500/25 bg-sky-500/12 text-sky-700 dark:border-sky-300/30 dark:bg-sky-300/14 dark:text-sky-100',
    icon: Users2,
    key: 'Teams',
  },
  {
    color:
      'border-emerald-500/25 bg-emerald-500/12 text-emerald-700 dark:border-emerald-300/30 dark:bg-emerald-300/14 dark:text-emerald-100',
    icon: FileText,
    key: 'Documents',
  },
  {
    color:
      'border-rose-500/25 bg-rose-500/12 text-rose-700 dark:border-rose-300/30 dark:bg-rose-300/14 dark:text-rose-100',
    icon: ListTodo,
    key: 'Tasks',
  },
  {
    color:
      'border-orange-500/25 bg-orange-500/12 text-orange-700 dark:border-orange-300/30 dark:bg-orange-300/14 dark:text-orange-100',
    icon: FolderKanban,
    key: 'Projects',
  },
];

export const SEARCH_CATEGORY_LOOKUP = Object.fromEntries(
  SEARCH_CATEGORIES.map((category) => [category.key, category]),
) as Record<SearchCategory, SearchCategoryDefinition>;

export const RECENT_ITEMS: SearchRecentItem[] = [
  {
    category: 'Projects',
    detail: 'Recently opened project space',
    icon: FolderKanban,
    id: 'recent-sisyphus-ventures',
    label: 'Sisyphus Ventures',
  },
  {
    category: 'Tasks',
    detail: 'Draft task from yesterday',
    icon: ListTodo,
    id: 'recent-sitemap-task',
    label: 'Add Sisyphus Ventures Sitemap',
  },
  {
    category: 'Documents',
    detail: 'Quick metadata action',
    icon: CirclePlus,
    id: 'recent-add-tag',
    label: 'Add tag',
  },
];

export const QUICK_ACTIONS: SearchQuickAction[] = [
  {
    description: 'Set a follow-up without leaving the palette',
    icon: AlarmClock,
    id: 'quick-remind-me',
    label: 'Remind me',
  },
  {
    count: 8,
    description: 'Review unread activity and mentions',
    icon: Bell,
    id: 'quick-notifications',
    label: 'Notifications',
  },
  {
    count: 4,
    description: 'Jump back into unread conversations',
    icon: MessageSquareText,
    id: 'quick-messages',
    label: 'Messages',
  },
  {
    description: 'Open the workspace overview',
    icon: LayoutDashboard,
    id: 'quick-dashboard',
    label: 'Dashboard',
  },
  {
    description: 'Expand into the full search view',
    icon: ScanSearch,
    id: 'quick-advanced-search',
    label: 'Advanced search',
  },
];

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    category: 'Projects',
    filename: 'Invoice 2025 - Sisyphus Ventures - January.pdf',
    id: 'result-invoice-sisyphus-january',
    keywords: ['finance', 'retainer', 'venture studio'],
  },
  {
    category: 'Projects',
    filename: 'Invoice 2025 - Sisyphus Ventures - February.pdf',
    id: 'result-invoice-sisyphus-february',
    keywords: ['finance', 'retainer', 'project billing'],
  },
  {
    category: 'Documents',
    filename: 'Invoice 2025 - Northwind Annual Renewal.pdf',
    id: 'result-invoice-northwind-renewal',
    keywords: ['accounts payable', 'renewal', 'contract'],
  },
  {
    category: 'Documents',
    filename: 'Invoice 2025 - Harbor Freight Media Buy.pdf',
    id: 'result-invoice-harbor-media',
    keywords: ['campaign', 'april', 'paid media'],
  },
  {
    category: 'Workflows',
    filename: 'Invoice 2025 - Expense Approval Workflow.pdf',
    id: 'result-invoice-expense-approval',
    keywords: ['workflow', 'approvals', 'finance ops'],
  },
  {
    category: 'Workflows',
    filename: 'Invoice 2025 - Vendor Onboarding Workflow.pdf',
    id: 'result-invoice-vendor-onboarding',
    keywords: ['workflow', 'vendors', 'compliance'],
  },
  {
    category: 'Teams',
    filename: 'Invoice 2025 - Product Operations Team.pdf',
    id: 'result-invoice-product-ops',
    keywords: ['team', 'shared budget', 'operations'],
  },
  {
    category: 'Teams',
    filename: 'Invoice 2025 - Accounts Payable Team.pdf',
    id: 'result-invoice-accounts-payable',
    keywords: ['team', 'approvals', 'finance'],
  },
  {
    category: 'Tasks',
    filename: 'Invoice 2025 - Sitemap Retainer Task.pdf',
    id: 'result-invoice-sitemap-task',
    keywords: ['task', 'website', 'sisyphus'],
  },
  {
    category: 'Tasks',
    filename: 'Invoice 2025 - Launch Budget Review Task.pdf',
    id: 'result-invoice-launch-task',
    keywords: ['task', 'launch', 'review'],
  },
  {
    category: 'Projects',
    filename: 'Invoice 2025 - Q2 Expansion Project.pdf',
    id: 'result-invoice-q2-expansion',
    keywords: ['project', 'expansion', 'forecast'],
  },
  {
    category: 'Documents',
    filename: 'Invoice 2025 - Client Archive Master.pdf',
    id: 'result-invoice-archive-master',
    keywords: ['archive', 'master file', 'history'],
  },
];

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: 'esc', label: 'Close' },
  { key: '#', label: 'Tags' },
  { key: '↑↓', label: 'Navigate' },
  { key: '⏎', label: 'Open' },
  { key: '←', label: 'Parent' },
];
