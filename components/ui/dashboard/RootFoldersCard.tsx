'use client';

import { Folder, LoaderCircle, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/common/Button';
import { StatusBanner } from '@/components/common/StatusBanner';
import { useRootFolders } from '@/hooks/useRootFolders';
import { deleteRootFolder } from '@/services/rootFolders';

type RootFoldersCardProps = {
  onAddFolder: () => void;
};

export const RootFoldersCard = ({ onAddFolder }: RootFoldersCardProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data: folders = [], error, isLoading, mutate } = useRootFolders();

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      await deleteRootFolder(id);
      await mutate();
      toast.success('Root folder removed.');
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : 'Could not remove root folder.',
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="shadow-pixel relative overflow-hidden border-2 border-foreground bg-background">
      <div className="absolute inset-y-0 right-0 w-20 bg-[linear-gradient(180deg,transparent_0%,rgba(var(--primary-rgb)/0.08)_100%)]" />

      <div className="relative flex h-full flex-col gap-5 px-5 py-6 sm:px-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 border-2 border-foreground/20 bg-background px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-primary">
            <Folder aria-hidden className="size-3.5" />
            Root Folders
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-lg uppercase text-foreground sm:text-xl">
              File Index Entry Points
            </h2>
            <p className="text-sm leading-6 text-foreground/60">
              The starting points shown at <code>/file/0/</code>.
            </p>
          </div>
        </div>

        {error ? (
          <StatusBanner tone="error">{error.message}</StatusBanner>
        ) : null}

        <div className="flex flex-1 flex-col gap-3">
          {isLoading ? (
            <div className="flex min-h-40 items-center justify-center border-dotted-2 border-foreground/30 bg-foreground/3 px-4 py-8 text-sm text-foreground/55">
              <div className="inline-flex items-center gap-2">
                <LoaderCircle aria-hidden className="size-4 animate-spin" />
                Loading configured folders
              </div>
            </div>
          ) : folders.length ? (
            <div className="flex flex-col gap-3">
              {folders.map((folder) => {
                const isDeleting = deletingId === folder.id;

                return (
                  <div
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-dotted-2 border-foreground/30 bg-background px-4 py-3 transition-colors hover:border-foreground/50 hover:bg-foreground/5"
                    key={folder.id}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center border-2 border-foreground/20 bg-primary/8 text-primary">
                          <Folder aria-hidden className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                            {folder.folderName}
                          </p>
                          <p className="truncate text-[12px] text-foreground/45 sm:text-xs">
                            {folder.folderId}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      appearance="icon"
                      aria-label={`Delete ${folder.folderName}`}
                      isDisabled={isDeleting}
                      isIconOnly
                      onPress={() => handleDelete(folder.id)}
                    >
                      {isDeleting ? (
                        <LoaderCircle
                          aria-hidden
                          className="size-4 animate-spin"
                        />
                      ) : (
                        <Trash2 aria-hidden className="size-4" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 border-dotted-2 border-foreground/30 bg-foreground/3 px-4 py-8 text-center">
              <div className="flex size-12 items-center justify-center border-2 border-foreground/20 bg-background text-primary">
                <Folder aria-hidden className="size-5" />
              </div>
              <p className="text-sm leading-6 text-foreground/55">
                No root folders configured yet.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-foreground/10 pt-1">
          <p className="text-[12px] text-foreground/45 sm:text-xs">
            Add multiple launch points for your file index.
          </p>
          <Button appearance="secondary" onPress={onAddFolder}>
            <Plus aria-hidden className="size-4" />
            Add Folder
          </Button>
        </div>
      </div>
    </section>
  );
};
