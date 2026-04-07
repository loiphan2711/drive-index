'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SearchCategory } from '@/type/search-dialog';

import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import {
  Command as CommandIcon,
  FileSearch,
  Hash,
  Search,
  X,
} from 'lucide-react';
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
} from '@/constants/search';
import { CategoryBadge } from './CategoryBadge';

import { CountBadge } from './CountBadge';
import { FilterTag } from './FilterTag';
import { ShortcutKey } from './ShortcutKey';
import { highlightMatch } from './utils';

const SEARCH_TERM_SPLIT_PATTERN = /\s+/;

type SearchModalDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  trigger?: (open: boolean) => ReactNode;
};

export const SearchModalDialog = ({
  onOpenChange,
  open,
  trigger,
}: SearchModalDialogProps) => {
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
      {trigger ? (
        <Dialog.Trigger asChild>{trigger(open)}</Dialog.Trigger>
      ) : null}
      <Dialog.Portal>
        <Dialog.Overlay {...overlayProps} />
        <div className="cmdk-dialog-shell">
          <Dialog.Content
            {...contentProps}
            aria-label="Search drive"
            className="flex max-h-full min-h-0 w-full max-w-3xl outline-none"
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
              className="flex min-h-0 max-h-full w-full flex-1 flex-col overflow-hidden rounded-[2rem] border border-(--cmdk-panel-border) text-[13px] sm:text-sm"
              loop
              shouldFilter={false}
            >
              <div className="border-b border-(--cmdk-divider) px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.35rem] border border-(--cmdk-input-border) bg-(--cmdk-input-bg) px-4 py-3 shadow-[inset_0_1px_0_var(--cmdk-input-inset)]">
                    <Search
                      aria-hidden
                      className="size-4 shrink-0 text-(--cmdk-text-muted)"
                    />
                    <Command.Input
                      aria-label="Search query"
                      className="w-0 min-w-0 flex-1 bg-transparent text-sm text-(--cmdk-text) outline-none placeholder:text-(--cmdk-text-faint) sm:text-[15px]"
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
                  <button
                    aria-label="Close search dialog"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-(--cmdk-kbd-border) bg-(--cmdk-kbd-bg) text-(--cmdk-text-muted) transition-colors hover:text-(--cmdk-text) sm:size-9"
                    onClick={handleClose}
                    type="button"
                  >
                    <X aria-hidden className="size-4" />
                  </button>
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
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-(--cmdk-text-muted) sm:text-xs">
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
                              <p className="truncate text-[13px] font-medium text-(--cmdk-text) sm:text-sm">
                                {item.label}
                              </p>
                              <p className="mt-1 truncate text-[11px] text-(--cmdk-text-muted) sm:text-xs">
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
                              <p className="truncate text-[13px] font-medium text-(--cmdk-text) sm:text-sm">
                                {action.label}
                              </p>
                              <p className="mt-1 truncate text-[11px] text-(--cmdk-text-muted) sm:text-xs">
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
                    <Command.Empty className="px-4 py-14 text-center text-[13px] text-(--cmdk-text-muted) sm:text-sm">
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
                                <p className="truncate text-[13px] font-medium text-(--cmdk-text) sm:text-sm">
                                  {highlightMatch(item.filename, query)}
                                </p>
                                <p className="mt-1 truncate text-[11px] text-(--cmdk-text-muted) sm:text-xs">
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
                          className="mx-2 flex cursor-pointer items-center justify-between rounded-2xl border border-(--cmdk-item-hover-border) bg-(--cmdk-icon-bg) px-4 py-3 text-[13px] font-medium text-(--cmdk-text) outline-none transition-colors data-[selected=true]:bg-(--cmdk-item-hover-bg) sm:text-sm"
                          onSelect={handleClose}
                          value="show-results"
                        >
                          <span>Show {filteredResults.length} results</span>
                          <span className="text-[11px] uppercase tracking-[0.18em] text-(--cmdk-text-muted) sm:text-xs">
                            Enter
                          </span>
                        </Command.Item>
                      </>
                    ) : null}
                  </>
                )}
              </Command.List>

              <section className="hidden flex-wrap items-center gap-3 border-t border-(--cmdk-divider) bg-(--cmdk-footer-bg) px-4 py-3 sm:flex sm:px-6">
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
