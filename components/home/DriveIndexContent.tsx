'use client';

import type { DriveItem, FileCategory } from '@/type/file';
import { FILE_CATEGORY_STYLES } from '@/constants/file-type';
import { useViewMode } from '@/context/useViewMode';

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
  iconOnly,
  item,
  variant = 'default',
}: {
  iconOnly?: boolean;
  item: DriveItem;
  variant?: 'default' | 'overlay';
}) {
  const style = getFileCategoryStyle(item);
  const Icon = style.icon;
  const badgeClassName =
    variant === 'overlay'
      ? `border ${style.overlayColor} bg-white/90 shadow-sm dark:bg-[#1c202b]/90`
      : style.color;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full text-[10px] font-semibold uppercase tracking-[0.22em] ${iconOnly ? 'px-1.5 py-1' : 'gap-1.5 px-2.5 py-1'} ${badgeClassName}`}
    >
      <Icon aria-hidden className="size-3" />
      {iconOnly ? <span className="sr-only">{style.label}</span> : style.label}
    </span>
  );
}

function DriveItemPreviewSlot({ item }: { item: DriveItem }) {
  const style = getFileCategoryStyle(item);
  const Icon = style.icon;

  if (item.thumbnailUrl) {
    return (
      <div className="relative h-28 w-full overflow-hidden rounded-lg border border-foreground/10 bg-foreground/3 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        {/* The compact preview uses a plain img for lightweight mock-data thumbnails. */}
        {/* eslint-disable-next-line next/no-img-element */}
        <img
          alt={`Preview of ${item.name}`}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.05]"
          loading="lazy"
          src={item.thumbnailUrl}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-white/10 dark:from-black/35 dark:to-white/5" />
        <div
          className={`absolute bottom-1.5 right-1.5 flex size-5 items-center justify-center rounded-md border bg-background/85 shadow-sm backdrop-blur ${style.overlayColor}`}
        >
          <Icon aria-hidden className="size-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-lg border border-foreground/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_45%)]">
      <div
        className={`flex size-8 items-center justify-center rounded-md border shadow-[0_10px_24px_-18px_rgba(28,32,43,0.75)] ${style.color}`}
      >
        <Icon aria-hidden className="size-4" />
      </div>
    </div>
  );
}

function DriveGrid({ items }: { items: DriveItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((item) => {
        const style = getFileCategoryStyle(item);

        return (
          <article
            key={item.id}
            className={`group isolate flex h-full flex-col overflow-hidden rounded-xl border border-foreground/10 border-t-4 bg-background/95 shadow-[0_4px_20px_-4px_rgba(28,32,43,0.25)] transition-all duration-150 will-change-transform hover:-translate-y-0.5 hover:border-b-foreground/20 hover:border-l-foreground/20 hover:border-r-foreground/20 hover:shadow-[0_12px_32px_-12px_rgba(28,32,43,0.28)] ${style.accent}`}
          >
            <div className="px-3 pt-3">
              <DriveItemPreviewSlot item={item} />
            </div>

            <div className="px-3 pb-3 pt-2">
              <p className="truncate text-xs font-semibold tracking-tight text-foreground">
                {item.name}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-foreground/50">
                {item.location}
              </p>
            </div>

            <div className="mx-3 h-px bg-foreground/8" />

            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <p className="truncate text-[11px] text-foreground/50">
                {item.modifiedAt}
                <span className="mx-1 text-foreground/30">·</span>
                {item.size}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function DriveTable({ items }: { items: DriveItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-foreground/10 bg-background/95 shadow-[0_18px_50px_-28px_rgba(28,32,43,0.35)]">
      <table className="w-full border-collapse text-left">
        <thead className="bg-foreground/3 text-[11px] uppercase tracking-[0.22em] text-foreground/45">
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
                className="border-t border-foreground/8 text-sm text-foreground/75 transition-colors duration-200 hover:bg-foreground/3"
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
