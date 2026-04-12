'use client';

import { cn, Spinner } from '@heroui/react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronRight, File, Folder, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { StatusBanner } from '@/components/common/StatusBanner';
import { useDriveItems } from '@/hooks/useDriveItems';

type FolderPickerModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (folderId: string, folderName: string) => Promise<void>;
};

type BreadcrumbFolder = {
  id: string;
  name: string;
};

type Source = 'my-drive' | 'shared-with-me' | 'shared-drives';

type SourceConfig = {
  folderId: string;
  id: Source;
  label: string;
  rootBreadcrumb: BreadcrumbFolder;
};

const SOURCES: SourceConfig[] = [
  {
    id: 'my-drive',
    label: 'My Drive',
    folderId: 'root',
    rootBreadcrumb: {
      id: 'root',
      name: 'My Drive',
    },
  },
  {
    id: 'shared-with-me',
    label: 'Shared with Me',
    folderId: 'shared-with-me',
    rootBreadcrumb: {
      id: 'shared-with-me',
      name: 'Shared with Me',
    },
  },
  {
    id: 'shared-drives',
    label: 'Shared Drives',
    folderId: 'shared-drives',
    rootBreadcrumb: {
      id: 'shared-drives',
      name: 'Shared Drives',
    },
  },
];

export const FolderPickerModal = ({
  open,
  onClose,
  onSelect,
}: FolderPickerModalProps) => {
  const [source, setSource] = useState<Source>(SOURCES[0].id);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbFolder[]>([
    SOURCES[0].rootBreadcrumb,
  ]);
  const [currentFolderId, setCurrentFolderId] = useState(SOURCES[0].folderId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  const isSearchMode = debouncedSearch.trim().length > 0;
  const currentSourceConfig =
    SOURCES.find((item) => item.id === source) ?? SOURCES[0];
  const {
    data: items = [],
    error,
    isLoading,
  } = useDriveItems(
    open ? (isSearchMode ? 'root' : currentFolderId) : null,
    isSearchMode ? debouncedSearch.trim() : undefined,
  );

  const displayItems = useMemo(
    () =>
      isSearchMode ? items : items.filter((item) => item.type === 'Folder'),
    [items, isSearchMode],
  );
  const currentFolder = breadcrumb.at(-1) ?? currentSourceConfig.rootBreadcrumb;
  const emptyStateText =
    searchQuery.trim() && !isSearchMode
      ? 'Type to search across all drives.'
      : isSearchMode
        ? 'No folders or files match your search.'
        : 'No child folders found here. You can still select the current folder from the action below.';
  const isVirtualSourceRoot =
    currentFolderId === currentSourceConfig.folderId && source !== 'my-drive';
  const isSelectCurrentDisabled =
    isSubmitting || isSearchMode || isVirtualSourceRoot;

  const handleNavigate = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setBreadcrumb((current) => [
      ...current,
      { id: folderId, name: folderName },
    ]);
  };

  const handleCrumbPress = (index: number) => {
    const nextBreadcrumb = breadcrumb.slice(0, index + 1);
    const nextCurrentFolder =
      nextBreadcrumb.at(-1) ?? currentSourceConfig.rootBreadcrumb;

    setBreadcrumb(nextBreadcrumb);
    setCurrentFolderId(nextCurrentFolder.id);
  };

  const handleSourceChange = (nextSource: Source) => {
    const config = SOURCES.find((item) => item.id === nextSource) ?? SOURCES[0];

    setSource(nextSource);
    setCurrentFolderId(config.folderId);
    setBreadcrumb([config.rootBreadcrumb]);
    setSearchQuery('');
    setDebouncedSearch('');
  };

  const handleNavigateFromSearch = (folderId: string, folderName: string) => {
    setSearchQuery('');
    setDebouncedSearch('');
    setCurrentFolderId(folderId);
    setBreadcrumb([
      currentSourceConfig.rootBreadcrumb,
      { id: folderId, name: folderName },
    ]);
  };

  const handleSelect = async (folderId: string, folderName: string) => {
    setIsSubmitting(true);

    try {
      await onSelect(folderId, folderName);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-70 bg-black/75 data-[state=closed]:animate-[cmdk-overlay-out_150ms_ease] data-[state=open]:animate-[cmdk-overlay-in_180ms_ease]" />

        <div className="fixed inset-0 z-80 flex items-end justify-center p-4 sm:items-center sm:p-6">
          <Dialog.Content
            aria-describedby="folder-picker-description"
            aria-label="Pick a folder"
            className="flex max-h-[min(88dvh,44rem)] min-h-0 w-full max-w-4xl flex-col overflow-hidden rounded-none border-2 border-foreground bg-background shadow-pixel outline-none data-[state=closed]:animate-[cmdk-dialog-out_150ms_ease-in] data-[state=open]:animate-[cmdk-dialog-in_200ms_cubic-bezier(0.16,1,0.3,1)]"
            onEscapeKeyDown={(event) => {
              if (isSubmitting) {
                event.preventDefault();
              }
            }}
            onPointerDownOutside={(event) => {
              if (isSubmitting) {
                event.preventDefault();
              }
            }}
          >
            <Dialog.Title className="sr-only">Pick a folder</Dialog.Title>
            <Dialog.Description className="sr-only">
              Browse Google Drive and choose a folder to save as a root folder.
            </Dialog.Description>

            <div className="flex items-start justify-between gap-4 border-b-2 border-foreground/10 px-5 py-5 sm:px-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 border-2 border-foreground/20 bg-background px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-primary">
                  <Folder aria-hidden className="size-3.5" />
                  Pick a Folder
                </div>
                <div>
                  <h2 className="font-display text-lg uppercase text-foreground sm:text-xl">
                    Browse Google Drive
                  </h2>
                  <p
                    className="mt-2 text-sm leading-6 text-foreground/60"
                    id="folder-picker-description"
                  >
                    Choose a folder to expose as a root entry point on the file
                    index.
                  </p>
                </div>
              </div>

              <Button
                appearance="icon"
                aria-label="Close folder picker"
                isDisabled={isSubmitting}
                isIconOnly
                onPress={onClose}
              >
                <X aria-hidden className="size-4" />
              </Button>
            </div>

            <div className="flex border-b-2 border-foreground/10 px-5 sm:px-6">
              {SOURCES.map((item) => (
                <button
                  className={cn(
                    'border-b-2 px-3 py-3 text-[11px] uppercase tracking-[0.12em] transition-colors sm:text-[12px]',
                    source === item.id
                      ? '-mb-[2px] border-primary text-primary'
                      : 'border-transparent text-foreground/55 hover:text-foreground',
                  )}
                  disabled={isSubmitting}
                  key={item.id}
                  onClick={() => handleSourceChange(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-b-2 border-foreground/10 px-5 py-3 sm:px-6">
              <Input
                aria-label="Search Google Drive"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search files and folders..."
                startContent={
                  <Search aria-hidden className="size-4 text-foreground/40" />
                }
                disabled={isSubmitting}
                value={searchQuery}
              />
            </div>

            <div className="flex min-h-0 flex-1 flex-col px-5 py-5 sm:px-6">
              {!isSearchMode ? (
                <div className="flex flex-wrap items-center gap-2 border-dotted-2 border-foreground/25 bg-foreground/4 px-3 py-3 text-[11px] uppercase tracking-[0.14em] text-foreground/60 sm:text-[12px]">
                  {breadcrumb.map((item, index) => {
                    const isCurrent = index === breadcrumb.length - 1;

                    return (
                      <div className="flex items-center gap-2" key={item.id}>
                        {index > 0 ? (
                          <ChevronRight
                            aria-hidden
                            className="size-3.5 text-foreground/35"
                          />
                        ) : null}
                        <button
                          className={cn(
                            'transition-colors',
                            isCurrent
                              ? 'text-primary'
                              : 'text-foreground/55 hover:text-foreground',
                          )}
                          disabled={isCurrent || isSubmitting}
                          onClick={() => handleCrumbPress(index)}
                          type="button"
                        >
                          {item.name}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {error ? (
                <div className={cn(!isSearchMode ? 'mt-4' : undefined)}>
                  <StatusBanner tone="error">{error.message}</StatusBanner>
                </div>
              ) : null}

              <div className="mt-4 min-h-0 flex-1 overflow-hidden border-dotted-2 border-foreground/25 bg-foreground/3">
                {isLoading ? (
                  <div className="flex h-full min-h-72 items-center justify-center">
                    <div className="inline-flex items-center gap-3 text-sm text-foreground/55">
                      <Spinner className="text-primary" size="sm" />
                      {isSearchMode ? 'Searching' : 'Loading folders'}
                    </div>
                  </div>
                ) : displayItems.length ? (
                  <div className="h-full overflow-y-auto">
                    <div className="flex flex-col divide-y divide-foreground/8">
                      {displayItems.map((item) => {
                        const isFolder = item.type === 'Folder';
                        const metadata =
                          item.type === 'Folder'
                            ? item.id
                            : [item.size, item.modifiedAt]
                                .filter(Boolean)
                                .join(' • ') || item.id;

                        return (
                          <div
                            className={cn(
                              'grid items-center gap-3 px-4 py-3',
                              isFolder
                                ? 'grid-cols-[minmax(0,1fr)_auto]'
                                : 'grid-cols-[minmax(0,1fr)]',
                            )}
                            key={item.id}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className={cn(
                                  'flex size-10 shrink-0 items-center justify-center border-2 border-foreground/20 bg-background',
                                  isFolder
                                    ? 'text-primary'
                                    : 'text-foreground/55',
                                )}
                              >
                                {isFolder ? (
                                  <Folder aria-hidden className="size-4" />
                                ) : (
                                  <File aria-hidden className="size-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                                  {item.name}
                                </p>
                                <p className="truncate text-[12px] text-foreground/45 sm:text-xs">
                                  {metadata}
                                </p>
                              </div>
                            </div>

                            {isFolder ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  appearance="secondary"
                                  isDisabled={isSubmitting}
                                  onPress={() =>
                                    handleSelect(item.id, item.name)
                                  }
                                >
                                  Select
                                </Button>
                                <Button
                                  appearance="icon"
                                  aria-label={`Open ${item.name}`}
                                  isDisabled={isSubmitting}
                                  isIconOnly
                                  onPress={() =>
                                    isSearchMode
                                      ? handleNavigateFromSearch(
                                          item.id,
                                          item.name,
                                        )
                                      : handleNavigate(item.id, item.name)
                                  }
                                >
                                  <ChevronRight
                                    aria-hidden
                                    className="size-4"
                                  />
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-72 flex-col items-center justify-center gap-3 px-6 text-center">
                    <div className="flex size-12 items-center justify-center border-2 border-foreground/20 bg-background text-primary">
                      <Folder aria-hidden className="size-5" />
                    </div>
                    <p className="max-w-sm text-sm leading-6 text-foreground/55">
                      {emptyStateText}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t-2 border-foreground/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-[12px] text-foreground/45 sm:text-xs">
                Current folder: {currentFolder.name}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  appearance="secondary"
                  isDisabled={isSubmitting}
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  isDisabled={isSelectCurrentDisabled}
                  isLoading={isSubmitting}
                  loadingText="Saving"
                  onPress={() =>
                    handleSelect(currentFolder.id, currentFolder.name)
                  }
                >
                  Select Current Folder
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
