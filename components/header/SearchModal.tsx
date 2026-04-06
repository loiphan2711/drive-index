'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SearchCategory } from '@/constants/search';

import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { Command as CommandIcon, FileSearch, Hash, Search } from 'lucide-react';
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  KEYBOARD_SHORTCUTS,
  MOCK_SEARCH_RESULTS,
  QUICK_ACTIONS,
  RECENT_ITEMS,
  SEARCH_CATEGORIES,
  SEARCH_CATEGORY_LOOKUP,
} from '@/constants/search';
import { highlightMatch } from '@/lib/highlightMatch';

const SEARCH_TERM_SPLIT_PATTERN = /\s+/;

type SearchModalProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

function CategoryBadge({ category }: { category: SearchCategory }) {
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
}

function FilterTag({
  active,
  category,
  onToggle,
}: {
  active: boolean;
  category: SearchCategory;
  onToggle: (category: SearchCategory) => void;
}) {
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
}

function CountBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex min-w-7 items-center justify-center rounded-full border border-(--cmdk-kbd-border) bg-(--cmdk-icon-bg) px-2 py-1 text-[11px] font-semibold text-(--cmdk-kbd-text)">
      {value}
    </span>
  );
}

function ShortcutKey({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <kbd
      className={`inline-flex h-7 items-center justify-center rounded-lg border border-(--cmdk-kbd-border) bg-(--cmdk-kbd-bg) px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--cmdk-kbd-text) shadow-[inset_0_1px_0_var(--cmdk-kbd-inset)] ${
        wide ? 'min-w-10' : 'min-w-7'
      }`}
    >
      {children}
    </kbd>
  );
}

export const SearchModal = ({ onOpenChange, open }: SearchModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<SearchCategory>>(
    () => new Set(),
  );
  const overlayProps = {
    'cmdk-overlay': '',
  } as ComponentPropsWithoutRef<typeof Dialog.Overlay>;
  const contentProps = {
    'cmdk-dialog': '',
  } as ComponentPropsWithoutRef<typeof Dialog.Content>;

  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  const hasQuery = query.trim().length > 0;
  const activeFilterNames = useMemo(
    () => Array.from(activeFilters).join(', '),
    [activeFilters],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setQuery('');
        setActiveFilters(new Set<SearchCategory>());
      }

      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  const filteredResults = useMemo(() => {
    const searchTerms = query
      .trim()
      .toLowerCase()
      .split(SEARCH_TERM_SPLIT_PATTERN)
      .filter(Boolean);

    if (searchTerms.length === 0) {
      return [];
    }

    return MOCK_SEARCH_RESULTS.filter((item) => {
      if (activeFilters.size > 0 && !activeFilters.has(item.category)) {
        return false;
      }

      const haystack = `${item.filename} ${item.keywords.join(
        ' ',
      )}`.toLowerCase();

      return searchTerms.every((term) => haystack.includes(term));
    });
  }, [activeFilters, query]);

  const handleClose = () => {
    handleOpenChange(false);
  };

  const handleToggleFilter = (category: SearchCategory) => {
    startTransition(() => {
      setActiveFilters((current) => {
        const next = new Set(current);

        if (next.has(category)) {
          next.delete(category);
        } else {
          next.add(category);
        }

        return next;
      });
    });
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay {...overlayProps} />
        <div className="cmdk-dialog-shell">
          <Dialog.Content
            {...contentProps}
            aria-label="Search drive"
            className="max-h-full w-full max-w-3xl outline-none"
            onEscapeKeyDown={(event) => {
              event.preventDefault();
              handleOpenChange(false);
            }}
            onPointerDownOutside={(event) => {
              event.preventDefault();
              handleOpenChange(false);
            }}
          >
            <Dialog.Title className="sr-only">Search drive</Dialog.Title>
            <Dialog.Description className="sr-only">
              Search for documents, workflows, or actions in your drive.
            </Dialog.Description>

            <Command
              className="flex max-h-full w-full flex-col overflow-hidden rounded-[2rem] border border-(--cmdk-panel-border) backdrop-blur-2xl"
              loop
              shouldFilter={false}
            >
              <div className="border-b border-(--cmdk-divider) px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3 rounded-[1.35rem] border border-(--cmdk-input-border) bg-(--cmdk-input-bg) px-4 py-3 shadow-[inset_0_1px_0_var(--cmdk-input-inset)]">
                  <Search
                    aria-hidden
                    className="size-4 shrink-0 text-(--cmdk-text-muted)"
                  />
                  <Command.Input
                    aria-label="Search query"
                    className="flex-1 bg-transparent text-[15px] text-(--cmdk-text) outline-none placeholder:text-(--cmdk-text-faint)"
                    onValueChange={setQuery}
                    placeholder="Search documents, workflows, or actions..."
                    ref={inputRef}
                    value={query}
                  />
                  <div className="hidden items-center gap-1 sm:flex">
                    <ShortcutKey>
                      <CommandIcon aria-hidden className="size-3.5" />
                    </ShortcutKey>
                    <ShortcutKey>K</ShortcutKey>
                  </div>
                </div>

                {!hasQuery ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SEARCH_CATEGORIES.map((category) => (
                      <FilterTag
                        active={activeFilters.has(category.key)}
                        category={category.key}
                        key={category.key}
                        onToggle={handleToggleFilter}
                      />
                    ))}
                  </div>
                ) : activeFilters.size > 0 ? (
                  <div className="mt-3 flex items-center gap-2 text-xs text-(--cmdk-text-muted)">
                    <Hash aria-hidden className="size-3.5" />
                    <p>
                      Filtered by {activeFilters.size} tag
                      {activeFilters.size > 1 ? 's' : ''}: {activeFilterNames}
                    </p>
                  </div>
                ) : null}
              </div>

              <Command.List className="min-h-0 flex-1 overflow-y-auto px-2 py-2 sm:px-3">
                {!hasQuery ? (
                  <>
                    <Command.Group heading="Recent">
                      {RECENT_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Command.Item
                            className="group mx-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-3 outline-none transition-colors data-[selected=true]:border-(--cmdk-item-hover-border) data-[selected=true]:bg-(--cmdk-item-hover-bg)"
                            key={item.id}
                            onSelect={handleClose}
                            value={item.id}
                          >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-(--cmdk-item-hover-border) bg-(--cmdk-icon-bg) text-(--cmdk-icon-text)">
                              <Icon aria-hidden className="size-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-(--cmdk-text)">
                                {item.label}
                              </p>
                              <p className="mt-1 text-xs text-(--cmdk-text-muted)">
                                {item.detail}
                              </p>
                            </div>
                            <CategoryBadge category={item.category} />
                          </Command.Item>
                        );
                      })}
                    </Command.Group>

                    <Command.Separator
                      alwaysRender
                      className="mx-4 my-2 h-px bg-(--cmdk-divider)"
                    />

                    <Command.Group heading="Quick actions">
                      {QUICK_ACTIONS.map((action) => {
                        const Icon = action.icon;

                        return (
                          <Command.Item
                            className="group mx-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-3 outline-none transition-colors data-[selected=true]:border-(--cmdk-item-hover-border) data-[selected=true]:bg-(--cmdk-item-hover-bg)"
                            key={action.id}
                            onSelect={handleClose}
                            value={action.id}
                          >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-(--cmdk-item-hover-border) bg-(--cmdk-icon-bg) text-(--cmdk-icon-text)">
                              <Icon aria-hidden className="size-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-(--cmdk-text)">
                                {action.label}
                              </p>
                              <p className="mt-1 text-xs text-(--cmdk-text-muted)">
                                {action.description}
                              </p>
                            </div>
                            {action.count ? (
                              <CountBadge value={action.count} />
                            ) : null}
                          </Command.Item>
                        );
                      })}
                    </Command.Group>
                  </>
                ) : (
                  <>
                    <Command.Empty className="px-4 py-14 text-center text-sm text-(--cmdk-text-muted)">
                      No results found.
                    </Command.Empty>

                    {filteredResults.length > 0 ? (
                      <>
                        <Command.Group heading="Search results">
                          {filteredResults.map((item) => (
                            <Command.Item
                              className="group mx-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-3 outline-none transition-colors data-[selected=true]:border-(--cmdk-item-hover-border) data-[selected=true]:bg-(--cmdk-item-hover-bg)"
                              key={item.id}
                              onSelect={handleClose}
                              value={item.id}
                            >
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-(--cmdk-item-hover-border) bg-(--cmdk-icon-bg) text-(--cmdk-icon-text)">
                                <FileSearch aria-hidden className="size-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-(--cmdk-text)">
                                  {highlightMatch(item.filename, query)}
                                </p>
                                <p className="mt-1 truncate text-xs text-(--cmdk-text-muted)">
                                  {item.keywords.join(' · ')}
                                </p>
                              </div>
                              <CategoryBadge category={item.category} />
                            </Command.Item>
                          ))}
                        </Command.Group>

                        <Command.Separator
                          alwaysRender
                          className="mx-4 my-2 h-px bg-(--cmdk-divider)"
                        />

                        <Command.Item
                          className="mx-2 flex cursor-pointer items-center justify-between rounded-2xl border border-(--cmdk-item-hover-border) bg-(--cmdk-icon-bg) px-4 py-3 text-sm font-medium text-(--cmdk-text) outline-none transition-colors data-[selected=true]:bg-(--cmdk-item-hover-bg)"
                          onSelect={handleClose}
                          value="show-results"
                        >
                          <span>Show {filteredResults.length} results</span>
                          <span className="text-xs uppercase tracking-[0.18em] text-(--cmdk-text-muted)">
                            Enter
                          </span>
                        </Command.Item>
                      </>
                    ) : null}
                  </>
                )}
              </Command.List>

              <section className="flex flex-wrap items-center gap-3 border-t border-(--cmdk-divider) bg-(--cmdk-footer-bg) px-4 py-3 sm:px-6">
                {KEYBOARD_SHORTCUTS.map((shortcut) => (
                  <div
                    className="flex items-center gap-2 text-xs text-(--cmdk-text-muted)"
                    key={`${shortcut.key}-${shortcut.label}`}
                  >
                    <ShortcutKey wide={shortcut.key.length > 1}>
                      {shortcut.key}
                    </ShortcutKey>
                    <span>{shortcut.label}</span>
                  </div>
                ))}
              </section>
            </Command>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
