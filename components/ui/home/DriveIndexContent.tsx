'use client';

import type { DriveItem, FileCategory } from '@/type/file';
import { FILE_CATEGORY_STYLES } from '@/constants/file-type';
import { useViewMode } from '@/context/useViewMode';
import { useDriveItems } from '@/hooks/useDriveItems';

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
      ? `shadow-pixel-sm ${style.overlayColor}`
      : style.color;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-none text-[10px] font-semibold uppercase tracking-[0.22em] ${iconOnly ? 'px-1.5 py-1' : 'gap-1.5 px-2.5 py-1'} ${badgeClassName}`}
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
      <div className="relative h-28 w-full overflow-hidden rounded-none border-2 border-foreground/20 bg-foreground/5">
        {/* The compact preview uses a plain img for lightweight mock-data thumbnails. */}
        {/* eslint-disable-next-line next/no-img-element */}
        <img
          alt={`Preview of ${item.name}`}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.05]"
          loading="lazy"
          src={item.thumbnailUrl}
        />
        <div className="absolute bottom-1.5 right-1.5">
          <DriveItemBadge iconOnly item={item} variant="overlay" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-none border-2 border-foreground/20 bg-foreground/5">
      <div
        className={`shadow-pixel-sm flex size-8 items-center justify-center rounded-none ${style.color}`}
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
            className={`group isolate flex h-full flex-col overflow-hidden rounded-none border-dotted-2 border-foreground/30 border-t-4 border-t-solid bg-background shadow-pixel-sm transition-[transform,box-shadow] duration-100 will-change-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${style.accent}`}
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
    <div className="overflow-hidden rounded-none border-2 border-foreground/30 bg-background shadow-pixel">
      <table className="w-full border-collapse text-left">
        <thead className="bg-foreground/8 text-[11px] uppercase tracking-[0.22em] text-foreground/45">
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
                className="border-t border-foreground/8 text-sm text-foreground/75 transition-colors duration-100 hover:bg-primary/8"
              >
                <td className="px-4 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-none ${style.color}`}
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
  const { data: items = [] } = useDriveItems();

  return (
    <div className="min-h-full">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {viewMode === 'grid' ? (
          <DriveGrid items={items} />
        ) : (
          <DriveTable items={items} />
        )}
      </main>
    </div>
  );
}
