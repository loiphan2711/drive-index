'use client';

import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/components/common/Breadcrumb';
import type { DriveItem, FileCategory } from '@/type/file';
import { ExternalLink, LoaderCircle, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Button, buttonVariants } from '@/components/common/Button';
import { StatusBanner } from '@/components/common/StatusBanner';
import { FILE_CATEGORY_STYLES } from '@/constants/file-type';
import { PAGE_PATHS } from '@/constants/path';
import { useViewMode } from '@/context/useViewMode';
import { useDriveItems } from '@/hooks/useDriveItems';
import { useGoogleConnection } from '@/hooks/useGoogleConnection';
import { FetchError } from '@/lib/swr/fetcher';
import { disconnectGoogle } from '@/services/google';

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

function decodePathSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function encodePathSegment(segment: string) {
  return encodeURIComponent(decodePathSegment(segment));
}

function getDriveItemHref(item: DriveItem, pathSegments: string[]) {
  if (item.type === 'Folder') {
    // URL structure: /file/0/FOLDER_ID/DisplayName1/DisplayName2/
    // path[0] = '0' (root sentinel, always preserved)
    // path[1] = actual Google Drive folder ID
    // path[2+] = human-readable display names
    const displayNames = pathSegments.slice(2).map(encodePathSegment);
    const nextPathSegments = [
      '0',
      encodeURIComponent(item.id),
      ...displayNames,
      encodePathSegment(item.name),
    ];

    return `/file/${nextPathSegments.join('/')}/`;
  }

  return `https://drive.google.com/open?id=${encodeURIComponent(item.id)}`;
}

function getCurrentPathLabel(pathSegments: string[]) {
  // path[0] = '0' sentinel, path[1] = folder ID, path[2+] = display names
  const displaySegments = pathSegments.slice(2);

  if (!displaySegments.length) {
    return '/';
  }

  return `/${displaySegments.map(decodePathSegment).join('/')}`;
}

function getBreadcrumbItems(pathSegments: string[]): BreadcrumbItem[] {
  // At root: pathSegments = ['0']
  if (pathSegments.length <= 1) {
    return [{ label: 'Root' }];
  }

  // Inside a folder: pathSegments = ['0', folderId, ...displayNames]
  const displaySegments = pathSegments.slice(2).map(decodePathSegment);

  if (!displaySegments.length) {
    return [{ label: 'Root', href: '/file/0/' }, { label: 'Current Folder' }];
  }

  return [
    { label: 'Root', href: '/file/0/' },
    ...displaySegments.slice(0, -1).map((segment) => ({ label: segment })),
    { label: displaySegments.at(-1) ?? 'Current Folder' },
  ];
}

function getItemLocation(item: DriveItem, currentPathLabel: string) {
  if (item.location && item.location !== '/') {
    return item.location;
  }

  return currentPathLabel;
}

function getFetchErrorCode(error: FetchError | undefined) {
  if (!error) {
    return null;
  }

  const info = error.info;

  if (
    !info ||
    typeof info !== 'object' ||
    !('code' in info) ||
    typeof info.code !== 'string'
  ) {
    return null;
  }

  return info.code;
}

function getGoogleErrorMessage(errorParam: string | null) {
  if (errorParam === 'google_storage_not_ready') {
    return 'Supabase chưa có bảng public.google_tokens. Hãy apply migration rồi connect lại Google Drive.';
  }

  if (errorParam === 'google_auth_state_mismatch') {
    return 'Google Drive authentication expired before it could be completed. Start the connection again.';
  }

  if (errorParam === 'google_auth_failed') {
    return 'Google Drive authentication failed. Try the connection flow again.';
  }

  return null;
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
      className={`inline-flex items-center justify-center rounded-none text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-[12px] ${iconOnly ? 'px-1.5 py-1' : 'gap-1.5 px-2.5 py-1'} ${badgeClassName}`}
    >
      <Icon aria-hidden className="size-3" />
      {iconOnly ? <span className="sr-only">{style.label}</span> : style.label}
    </span>
  );
}

function DriveItemPreviewSlot({ item }: { item: DriveItem }) {
  const [hasThumbnailError, setHasThumbnailError] = useState(false);
  const style = getFileCategoryStyle(item);
  const Icon = style.icon;

  if (item.thumbnailUrl && !hasThumbnailError) {
    return (
      <div className="relative h-28 w-full overflow-hidden rounded-none border-2 border-foreground/20 bg-foreground/5">
        {/* eslint-disable-next-line next/no-img-element */}
        <img
          alt={`Preview of ${item.name}`}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.05]"
          loading="lazy"
          onError={() => setHasThumbnailError(true)}
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

function DriveGrid({
  currentPathLabel,
  items,
  pathSegments,
}: {
  currentPathLabel: string;
  items: DriveItem[];
  pathSegments: string[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((item) => {
        const style = getFileCategoryStyle(item);
        const cardContent = (
          <>
            <div className="px-3 pt-3">
              <DriveItemPreviewSlot item={item} />
            </div>

            <div className="px-3 pb-3 pt-2">
              <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                {item.name}
              </p>
              <p className="mt-0.5 truncate text-[12px] text-foreground/50 sm:text-xs">
                {getItemLocation(item, currentPathLabel)}
              </p>
            </div>

            <div className="mx-3 h-px bg-foreground/8" />

            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <p className="truncate text-[12px] text-foreground/50 sm:text-xs">
                {item.modifiedAt}
                <span className="mx-1 text-foreground/30">·</span>
                {item.size}
              </p>
              {item.type === 'File' ? (
                <ExternalLink
                  aria-hidden
                  className="size-3.5 shrink-0 text-foreground/35"
                />
              ) : null}
            </div>
          </>
        );
        const className = `group isolate flex h-full flex-col overflow-hidden rounded-none border-dotted-2 border-foreground/30 border-t-4 border-t-solid bg-background shadow-pixel-sm transition-[transform,box-shadow] duration-100 will-change-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${style.accent}`;

        if (item.type === 'Folder') {
          return (
            <Link
              key={item.id}
              className={className}
              href={getDriveItemHref(item, pathSegments)}
            >
              {cardContent}
            </Link>
          );
        }

        return (
          <a
            key={item.id}
            className={className}
            href={getDriveItemHref(item, pathSegments)}
            rel="noreferrer"
            target="_blank"
          >
            {cardContent}
          </a>
        );
      })}
    </div>
  );
}

function DriveTable({
  currentPathLabel,
  items,
  pathSegments,
}: {
  currentPathLabel: string;
  items: DriveItem[];
  pathSegments: string[];
}) {
  return (
    <div className="overflow-hidden rounded-none border-2 border-foreground/30 bg-background shadow-pixel">
      <table className="w-full border-collapse text-left">
        <thead className="bg-foreground/8 text-[12px] uppercase tracking-[0.22em] text-foreground/45 sm:text-xs">
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
                className="border-t border-foreground/8 text-sm text-foreground/75 transition-colors duration-100 hover:bg-primary/8 sm:text-base"
              >
                <td className="px-4 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-none ${style.color}`}
                    >
                      <Icon aria-hidden className="size-4" />
                    </div>
                    <div className="min-w-0">
                      {item.type === 'Folder' ? (
                        <Link
                          className="inline-flex max-w-full items-center gap-1 truncate font-semibold text-foreground transition-colors duration-100 hover:text-primary"
                          href={getDriveItemHref(item, pathSegments)}
                        >
                          <span className="truncate">{item.name}</span>
                        </Link>
                      ) : (
                        <a
                          className="inline-flex max-w-full items-center gap-1 truncate font-semibold text-foreground transition-colors duration-100 hover:text-primary"
                          href={getDriveItemHref(item, pathSegments)}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <span className="truncate">{item.name}</span>
                          <ExternalLink
                            aria-hidden
                            className="size-3.5 shrink-0"
                          />
                        </a>
                      )}
                      <div className="truncate text-sm text-foreground/55">
                        {getItemLocation(item, currentPathLabel)}
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

function StatePanel({
  actions,
  description,
  eyebrow,
  title,
}: {
  actions?: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="shadow-pixel relative overflow-hidden border-2 border-foreground bg-background px-6 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,transparent_65%,rgba(42,63,229,0.08)_65%,rgba(42,63,229,0.08)_100%)]" />
      <div className="relative flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <p className="font-display text-[11px] uppercase tracking-[0.22em] text-primary sm:text-[12px]">
            {eyebrow}
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-xl uppercase leading-tight text-foreground sm:text-2xl">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-foreground/60 sm:text-base">
                {description}
              </p>
            </div>

            {actions ? (
              <div className="flex flex-wrap items-center gap-3">{actions}</div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

type DriveIndexContentProps = {
  folderId: string | null;
  pathSegments: string[];
};

export const DriveIndexContent = ({
  folderId,
  pathSegments,
}: DriveIndexContentProps) => {
  const { viewMode } = useViewMode();
  const searchParams = useSearchParams();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const currentPathLabel = getCurrentPathLabel(pathSegments);
  const breadcrumbItems = getBreadcrumbItems(pathSegments);
  const connectionBanner = getGoogleErrorMessage(searchParams.get('error'));
  const {
    data: connection,
    error: connectionError,
    isLoading: isConnectionLoading,
    mutate: mutateConnection,
  } = useGoogleConnection();
  const connectionErrorCode = getFetchErrorCode(connectionError);
  const isSignedOut =
    connectionError instanceof FetchError && connectionError.status === 401;
  const resolvedFolderId = folderId ?? '0';
  const shouldLoadItems = Boolean(connection?.connected);
  const {
    data: items = [],
    error: itemsError,
    isLoading: isItemsLoading,
    mutate: mutateItems,
  } = useDriveItems(shouldLoadItems ? resolvedFolderId : null);
  const itemErrorCode = getFetchErrorCode(itemsError);
  const needsStorageSetup =
    itemErrorCode === 'google_storage_not_ready' ||
    connectionErrorCode === 'google_storage_not_ready';
  const needsReconnect =
    itemErrorCode === 'google_connection_expired' ||
    itemErrorCode === 'google_not_connected' ||
    connectionErrorCode === 'google_connection_expired';
  const showConnectionPrompt =
    !isConnectionLoading &&
    (isSignedOut ||
      !connection?.connected ||
      needsReconnect ||
      needsStorageSetup);

  const handleDisconnect = async () => {
    setIsDisconnecting(true);

    try {
      await disconnectGoogle();
      await mutateConnection({ connected: false }, { revalidate: false });
      await mutateItems([], { revalidate: false });
      toast.success('Google Drive disconnected.');
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : 'Could not disconnect Google Drive.',
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="min-h-full">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {connectionBanner ? (
          <StatusBanner tone="error">{connectionBanner}</StatusBanner>
        ) : null}

        {connectionError && !isSignedOut && !connection?.connected ? (
          <StatusBanner tone="error">{connectionError.message}</StatusBanner>
        ) : null}

        {isConnectionLoading ? (
          <StatePanel
            eyebrow="Syncing"
            title="Checking your Drive connection"
            description="The file index waits for your Supabase session and Google Drive link before loading folder contents."
            actions={
              <div className="inline-flex items-center gap-2 border-2 border-foreground/30 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-foreground/60 sm:text-[12px]">
                <LoaderCircle aria-hidden className="size-4 animate-spin" />
                Checking status
              </div>
            }
          />
        ) : null}

        {showConnectionPrompt ? (
          <StatePanel
            eyebrow={
              isSignedOut
                ? 'Locked'
                : needsStorageSetup
                  ? 'Setup Required'
                  : needsReconnect
                    ? 'Disconnected'
                    : 'Not Connected'
            }
            title={
              isSignedOut
                ? 'Sign in required'
                : needsStorageSetup
                  ? 'Token storage is not configured'
                  : needsReconnect
                    ? 'Google Drive connection expired'
                    : 'Google Drive is not connected'
            }
            description={
              isSignedOut
                ? 'This file index requires authentication. Sign in to access the Google Drive connection.'
                : needsStorageSetup
                  ? 'Supabase chưa có bảng public.google_tokens. Apply migration trước khi connect Google Drive.'
                  : needsReconnect
                    ? 'The saved Google Drive tokens have expired or are no longer valid. Re-authentication is needed.'
                    : 'This account has not linked Google Drive yet. A connection is needed to browse files.'
            }
          />
        ) : null}

        {!showConnectionPrompt && !isConnectionLoading ? (
          <>
            <StatePanel
              eyebrow="Live Drive"
              title="Google Drive index is connected"
              description={`Browsing ${currentPathLabel}. Folder items stay in-app while files open directly in Google Drive.`}
              actions={
                <>
                  <Link
                    className={buttonVariants({ appearance: 'secondary' })}
                    href={PAGE_PATHS.googleAuth}
                  >
                    <span className="inline-flex items-center gap-2">
                      <RefreshCcw aria-hidden className="size-4" />
                      Reconnect
                    </span>
                  </Link>
                  <Button
                    appearance="secondary"
                    isLoading={isDisconnecting}
                    loadingText="Disconnecting"
                    onPress={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </>
              }
            />

            <Breadcrumb items={breadcrumbItems} />

            {itemsError && !needsReconnect ? (
              <StatusBanner tone="error">{itemsError.message}</StatusBanner>
            ) : null}

            {isItemsLoading ? (
              <div className="shadow-pixel flex items-center gap-3 border-2 border-foreground/30 bg-background px-5 py-4 text-sm text-foreground/65">
                <LoaderCircle aria-hidden className="size-4 animate-spin" />
                Loading files from Google Drive...
              </div>
            ) : null}

            {!isItemsLoading && !itemsError && items.length === 0 ? (
              <div className="shadow-pixel flex flex-col gap-3 border-2 border-foreground/30 bg-background px-6 py-8">
                <p className="font-display text-[11px] uppercase tracking-[0.22em] text-primary sm:text-[12px]">
                  Empty Folder
                </p>
                <h2 className="font-display text-lg uppercase text-foreground sm:text-xl">
                  Nothing is inside this folder yet
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-foreground/60 sm:text-base">
                  Google Drive returned an empty result for {currentPathLabel}.
                  Try another folder or upload content into the shared root.
                </p>
              </div>
            ) : null}

            {!isItemsLoading && !itemsError && items.length > 0 ? (
              viewMode === 'grid' ? (
                <DriveGrid
                  currentPathLabel={currentPathLabel}
                  items={items}
                  pathSegments={pathSegments}
                />
              ) : (
                <DriveTable
                  currentPathLabel={currentPathLabel}
                  items={items}
                  pathSegments={pathSegments}
                />
              )
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  );
};
