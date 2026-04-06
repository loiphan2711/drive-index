'use client';

import type { LucideIcon } from 'lucide-react';
import {
  File,
  FileText,
  FileType,
  FolderOpen,
  Image,
  Sheet,
} from 'lucide-react';

import { useViewMode } from '@/context/useViewMode';

type DriveItem = {
  extension?: string;
  id: string;
  location: string;
  modifiedAt: string;
  name: string;
  size: string;
  thumbnailUrl?: string;
  type: 'File' | 'Folder';
};

type FileCategory =
  | 'document'
  | 'folder'
  | 'generic'
  | 'image'
  | 'pdf'
  | 'spreadsheet';

type FileCategoryStyle = {
  accent: string;
  bgSubtle: string;
  color: string;
  icon: LucideIcon;
  label: string;
  overlayColor: string;
};

const FILE_CATEGORY_STYLES: Record<FileCategory, FileCategoryStyle> = {
  document: {
    accent: 'border-t-sky-500/55 dark:border-t-sky-300/45',
    bgSubtle:
      'bg-gradient-to-br from-sky-500/18 via-sky-500/6 to-background dark:from-sky-300/18 dark:via-sky-300/7 dark:to-background',
    color:
      'border-sky-500/25 bg-sky-500/12 text-sky-700 dark:border-sky-300/30 dark:bg-sky-300/14 dark:text-sky-100',
    icon: FileText,
    label: 'Document',
    overlayColor:
      'border-sky-500/25 text-sky-700 dark:border-sky-300/30 dark:text-sky-100',
  },
  folder: {
    accent: 'border-t-amber-500/55 dark:border-t-amber-300/45',
    bgSubtle:
      'bg-gradient-to-br from-amber-500/18 via-amber-500/6 to-background dark:from-amber-300/18 dark:via-amber-300/7 dark:to-background',
    color:
      'border-amber-500/25 bg-amber-500/12 text-amber-700 dark:border-amber-300/30 dark:bg-amber-300/14 dark:text-amber-100',
    icon: FolderOpen,
    label: 'Folder',
    overlayColor:
      'border-amber-500/25 text-amber-700 dark:border-amber-300/30 dark:text-amber-100',
  },
  generic: {
    accent: 'border-t-zinc-500/40 dark:border-t-zinc-300/35',
    bgSubtle:
      'bg-gradient-to-br from-zinc-500/16 via-zinc-500/6 to-background dark:from-zinc-300/16 dark:via-zinc-300/7 dark:to-background',
    color:
      'border-zinc-500/20 bg-zinc-500/10 text-zinc-700 dark:border-zinc-300/25 dark:bg-zinc-300/12 dark:text-zinc-100',
    icon: File,
    label: 'File',
    overlayColor:
      'border-zinc-500/20 text-zinc-700 dark:border-zinc-300/25 dark:text-zinc-100',
  },
  image: {
    accent: 'border-t-violet-500/55 dark:border-t-violet-300/45',
    bgSubtle:
      'bg-gradient-to-br from-violet-500/20 via-violet-500/7 to-background dark:from-violet-300/18 dark:via-violet-300/8 dark:to-background',
    color:
      'border-violet-500/25 bg-violet-500/12 text-violet-700 dark:border-violet-300/30 dark:bg-violet-300/14 dark:text-violet-100',
    icon: Image,
    label: 'Image',
    overlayColor:
      'border-violet-500/25 text-violet-700 dark:border-violet-300/30 dark:text-violet-100',
  },
  pdf: {
    accent: 'border-t-rose-500/55 dark:border-t-rose-300/45',
    bgSubtle:
      'bg-gradient-to-br from-rose-500/18 via-rose-500/6 to-background dark:from-rose-300/18 dark:via-rose-300/7 dark:to-background',
    color:
      'border-rose-500/25 bg-rose-500/12 text-rose-700 dark:border-rose-300/30 dark:bg-rose-300/14 dark:text-rose-100',
    icon: FileType,
    label: 'PDF',
    overlayColor:
      'border-rose-500/25 text-rose-700 dark:border-rose-300/30 dark:text-rose-100',
  },
  spreadsheet: {
    accent: 'border-t-emerald-500/55 dark:border-t-emerald-300/45',
    bgSubtle:
      'bg-gradient-to-br from-emerald-500/18 via-emerald-500/6 to-background dark:from-emerald-300/18 dark:via-emerald-300/7 dark:to-background',
    color:
      'border-emerald-500/25 bg-emerald-500/12 text-emerald-700 dark:border-emerald-300/30 dark:bg-emerald-300/14 dark:text-emerald-100',
    icon: Sheet,
    label: 'Spreadsheet',
    overlayColor:
      'border-emerald-500/25 text-emerald-700 dark:border-emerald-300/30 dark:text-emerald-100',
  },
};

const FILE_CATEGORY_BY_EXTENSION: Partial<Record<string, FileCategory>> = {
  csv: 'spreadsheet',
  doc: 'document',
  docx: 'document',
  gif: 'image',
  jpeg: 'image',
  jpg: 'image',
  md: 'document',
  pdf: 'pdf',
  png: 'image',
  svg: 'image',
  txt: 'document',
  webp: 'image',
  xls: 'spreadsheet',
  xlsx: 'spreadsheet',
};

const DRIVE_ITEMS: DriveItem[] = [
  {
    id: 'design-system',
    location: '/shared/ui',
    modifiedAt: '2 hours ago',
    name: 'Design System',
    size: '18 items',
    type: 'Folder',
  },
  {
    extension: 'xlsx',
    id: 'q1-budget',
    location: '/finance/reports',
    modifiedAt: 'Yesterday',
    name: 'Q1 Budget.xlsx',
    size: '2.1 MB',
    type: 'File',
  },
  {
    id: 'launch-assets',
    location: '/marketing/launch',
    modifiedAt: 'Mar 30',
    name: 'Launch Assets',
    size: '34 items',
    type: 'Folder',
  },
  {
    extension: 'md',
    id: 'roadmap',
    location: '/product',
    modifiedAt: 'Mar 28',
    name: 'Roadmap Notes.md',
    size: '48 KB',
    type: 'File',
  },
  {
    id: 'customer-research',
    location: '/research/interviews',
    modifiedAt: 'Mar 24',
    name: 'Customer Research',
    size: '12 items',
    type: 'Folder',
  },
  {
    extension: 'pdf',
    id: 'release-checklist',
    location: '/ops/releases',
    modifiedAt: 'Mar 21',
    name: 'Release Checklist.pdf',
    size: '640 KB',
    type: 'File',
  },
  {
    extension: 'jpg',
    id: 'brand-shoot',
    location: '/marketing/photoshoot',
    modifiedAt: 'Mar 19',
    name: 'Brand Shoot Hero.jpg',
    size: '5.8 MB',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    type: 'File',
  },
  {
    extension: 'png',
    id: 'workspace-mockup',
    location: '/design/mockups',
    modifiedAt: 'Mar 18',
    name: 'Workspace Mockup.png',
    size: '3.4 MB',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
    type: 'File',
  },
];

function getFileCategory(item: DriveItem): FileCategory {
  if (item.type === 'Folder') {
    return 'folder';
  }

  if (!item.extension) {
    return 'generic';
  }

  return FILE_CATEGORY_BY_EXTENSION[item.extension.toLowerCase()] ?? 'generic';
}

function getFileCategoryStyle(item: DriveItem) {
  return FILE_CATEGORY_STYLES[getFileCategory(item)];
}

function DriveItemBadge({
  item,
  variant = 'default',
}: {
  item: DriveItem;
  variant?: 'default' | 'overlay';
}) {
  const style = getFileCategoryStyle(item);
  const Icon = style.icon;
  const badgeClassName =
    variant === 'overlay'
      ? `border ${style.overlayColor} bg-white/80 shadow-sm backdrop-blur-md dark:bg-black/60`
      : style.color;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${badgeClassName}`}
    >
      <Icon aria-hidden className="size-3" />
      {style.label}
    </span>
  );
}

function DriveItemPreview({ item }: { item: DriveItem }) {
  const style = getFileCategoryStyle(item);
  const Icon = style.icon;

  return (
    <div
      className={`relative aspect-[4/3] overflow-hidden rounded-t-2xl border-b border-foreground/8 ${style.bgSubtle}`}
    >
      <div className="absolute left-2 top-2 z-10">
        <DriveItemBadge item={item} variant="overlay" />
      </div>

      {item.thumbnailUrl ? (
        <>
          {/* The preview intentionally uses a plain img for lightweight mock-data thumbnails. */}
          {/* eslint-disable-next-line next/no-img-element */}
          <img
            alt={`Preview of ${item.name}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            src={item.thumbnailUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-white/10 dark:from-black/40 dark:via-black/10 dark:to-white/5" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_45%)]" />
          <div className="relative flex h-full flex-col justify-between p-4">
            <div />
            <div className="flex items-end justify-between gap-4">
              <div
                className={`flex size-14 items-center justify-center rounded-[1.2rem] border shadow-[0_18px_30px_-22px_rgba(15,23,42,0.9)] ${style.color}`}
              >
                <Icon aria-hidden className="size-7" />
              </div>
              {item.extension ? (
                <span className="rounded-full border border-foreground/10 bg-background/72 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55 backdrop-blur">
                  {item.extension}
                </span>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DriveGrid({ items }: { items: DriveItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const style = getFileCategoryStyle(item);

        return (
          <article
            key={item.id}
            className={`group isolate overflow-hidden rounded-2xl border border-foreground/10 border-t-4 bg-background/80 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.4)] backdrop-blur-xl transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:border-b-foreground/20 hover:border-l-foreground/20 hover:border-r-foreground/20 hover:shadow-[0_24px_70px_-30px_rgba(15,23,42,0.46)] ${style.accent}`}
          >
            <DriveItemPreview item={item} />

            <div className="p-3">
              <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                {item.name}
              </p>
              <p className="mt-1 truncate text-xs text-foreground/55">
                {item.location}
              </p>

              <div className="my-3 h-px bg-foreground/8" />

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-foreground/55">
                  {item.modifiedAt}
                  <span className="mx-1.5 text-foreground/30">·</span>
                  {item.size}
                </p>
                <DriveItemBadge item={item} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function DriveTable({ items }: { items: DriveItem[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-background/88 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <table className="w-full border-collapse text-left">
        <thead className="bg-foreground/[0.03] text-[11px] uppercase tracking-[0.22em] text-foreground/45">
          <tr>
            <th className="px-4 py-3 font-semibold sm:px-6">Name</th>
            <th className="hidden px-4 py-3 font-semibold md:table-cell">
              Type
            </th>
            <th className="px-4 py-3 font-semibold sm:px-6">Modified</th>
            <th className="px-4 py-3 font-semibold sm:px-6">Size</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const style = getFileCategoryStyle(item);
            const Icon = style.icon;

            return (
              <tr
                key={item.id}
                className="border-t border-foreground/8 text-sm text-foreground/75 transition-colors duration-200 hover:bg-foreground/[0.03]"
              >
                <td className="px-4 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${style.color}`}
                    >
                      <Icon aria-hidden className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-foreground">
                        {item.name}
                      </div>
                      <div className="truncate text-xs text-foreground/55">
                        {item.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-4 md:table-cell">
                  <DriveItemBadge item={item} />
                </td>
                <td className="px-4 py-4 text-foreground/65 sm:px-6">
                  {item.modifiedAt}
                </td>
                <td className="px-4 py-4 text-foreground/65 sm:px-6">
                  {item.size}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function DriveIndexContent() {
  const { viewMode } = useViewMode();

  return (
    <div className="min-h-full bg-background">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {viewMode === 'grid' ? (
          <DriveGrid items={DRIVE_ITEMS} />
        ) : (
          <DriveTable items={DRIVE_ITEMS} />
        )}
      </main>
    </div>
  );
}
