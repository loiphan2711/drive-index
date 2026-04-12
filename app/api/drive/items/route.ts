import type { GoogleAuthenticatedClient, GoogleTokens } from '@/type/google';

import { NextResponse } from 'next/server';

import {
  createAuthenticatedClient,
  GoogleTokenRefreshError,
  isGoogleTokenExpired,
  refreshGoogleAccessToken,
} from '@/lib/google/auth';
import {
  GoogleApiError,
  listDriveItems,
  listSharedDrives,
  listSharedWithMe,
  searchDriveItems,
} from '@/lib/google/drive';
import { mapSharedDriveToDriveItem, mapToDriveItem } from '@/lib/google/mapper';
import {
  getRootFolders,
  RootFolderStorageError,
} from '@/lib/google/rootFolders';
import {
  deleteGoogleTokens,
  getGoogleTokens,
  GoogleTokenStorageError,
  saveGoogleTokens,
} from '@/lib/google/tokens';
import { createClient } from '@/lib/supabase/server';

const GOOGLE_NOT_CONNECTED_ERROR = {
  code: 'google_not_connected',
  error: 'Connect Google Drive before browsing files.',
};

const GOOGLE_RECONNECT_ERROR = {
  code: 'google_connection_expired',
  error: 'Google Drive access expired. Reconnect to continue.',
};

const GOOGLE_STORAGE_NOT_READY_ERROR = {
  code: 'google_storage_not_ready',
  error:
    'Google Drive token storage is missing. Apply the Supabase migration for public.google_tokens.',
};

const ROOT_FOLDER_STORAGE_NOT_READY_ERROR = {
  code: 'root_folder_storage_not_ready',
  error:
    'Drive root folder storage is missing. Apply the Supabase migration for public.drive_root_folders.',
};

const ROOT_FOLDER_SENTINEL = '0';
const SHARED_WITH_ME_SENTINEL = 'shared-with-me';
const SHARED_DRIVES_SENTINEL = 'shared-drives';

const getCurrentPath = (folderId: string) =>
  folderId === 'root' ? '/' : '/current-folder';

const refreshAndPersistTokens = async (
  client: GoogleAuthenticatedClient,
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) => {
  const refreshedTokens = await refreshGoogleAccessToken(client);
  await saveGoogleTokens(supabase, userId, refreshedTokens);

  return refreshedTokens;
};

const loadDriveFiles = async (
  client: GoogleAuthenticatedClient,
  folderId: string,
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) => {
  let activeTokens: GoogleTokens = client;

  if (isGoogleTokenExpired(client)) {
    activeTokens = await refreshAndPersistTokens(client, supabase, userId);
  }

  try {
    return await listDriveItems(
      createAuthenticatedClient(
        activeTokens,
        new URL(client.redirectUri).origin,
      ),
      folderId,
    );
  } catch (error) {
    if (!(error instanceof GoogleApiError) || error.status !== 401) {
      throw error;
    }

    activeTokens = await refreshAndPersistTokens(client, supabase, userId);

    return listDriveItems(
      createAuthenticatedClient(
        activeTokens,
        new URL(client.redirectUri).origin,
      ),
      folderId,
    );
  }
};

const loadSharedWithMe = async (
  client: GoogleAuthenticatedClient,
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) => {
  let activeTokens: GoogleTokens = client;

  if (isGoogleTokenExpired(client)) {
    activeTokens = await refreshAndPersistTokens(client, supabase, userId);
  }

  try {
    return await listSharedWithMe(
      createAuthenticatedClient(
        activeTokens,
        new URL(client.redirectUri).origin,
      ),
    );
  } catch (error) {
    if (!(error instanceof GoogleApiError) || error.status !== 401) {
      throw error;
    }

    activeTokens = await refreshAndPersistTokens(client, supabase, userId);

    return listSharedWithMe(
      createAuthenticatedClient(
        activeTokens,
        new URL(client.redirectUri).origin,
      ),
    );
  }
};

const loadSharedDrives = async (
  client: GoogleAuthenticatedClient,
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) => {
  let activeTokens: GoogleTokens = client;

  if (isGoogleTokenExpired(client)) {
    activeTokens = await refreshAndPersistTokens(client, supabase, userId);
  }

  try {
    return await listSharedDrives(
      createAuthenticatedClient(
        activeTokens,
        new URL(client.redirectUri).origin,
      ),
    );
  } catch (error) {
    if (!(error instanceof GoogleApiError) || error.status !== 401) {
      throw error;
    }

    activeTokens = await refreshAndPersistTokens(client, supabase, userId);

    return listSharedDrives(
      createAuthenticatedClient(
        activeTokens,
        new URL(client.redirectUri).origin,
      ),
    );
  }
};

const loadSearchResults = async (
  client: GoogleAuthenticatedClient,
  query: string,
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) => {
  let activeTokens: GoogleTokens = client;

  if (isGoogleTokenExpired(client)) {
    activeTokens = await refreshAndPersistTokens(client, supabase, userId);
  }

  try {
    return await searchDriveItems(
      createAuthenticatedClient(
        activeTokens,
        new URL(client.redirectUri).origin,
      ),
      query,
    );
  } catch (error) {
    if (!(error instanceof GoogleApiError) || error.status !== 401) {
      throw error;
    }

    activeTokens = await refreshAndPersistTokens(client, supabase, userId);

    return searchDriveItems(
      createAuthenticatedClient(
        activeTokens,
        new URL(client.redirectUri).origin,
      ),
      query,
    );
  }
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const tokens = await getGoogleTokens(supabase, user.id);

    if (!tokens) {
      return NextResponse.json(GOOGLE_NOT_CONNECTED_ERROR, { status: 401 });
    }

    const searchParam = requestUrl.searchParams.get('search');
    const requestedFolderId = requestUrl.searchParams.get('folderId');
    const folderId = !requestedFolderId
      ? ROOT_FOLDER_SENTINEL
      : requestedFolderId;
    const client = createAuthenticatedClient(tokens, requestUrl.origin);

    if (searchParam !== null && searchParam.trim()) {
      const files = await loadSearchResults(
        client,
        searchParam.trim(),
        supabase,
        user.id,
      );

      return NextResponse.json(files.map((file) => mapToDriveItem(file, '/')));
    }

    if (folderId === ROOT_FOLDER_SENTINEL) {
      const folders = await getRootFolders(supabase, user.id);

      return NextResponse.json(
        folders.map((folder) => ({
          id: folder.folderId,
          location: '/',
          modifiedAt: '',
          name: folder.folderName,
          size: '— items',
          type: 'Folder' as const,
        })),
      );
    }

    if (folderId === SHARED_WITH_ME_SENTINEL) {
      const files = await loadSharedWithMe(client, supabase, user.id);

      return NextResponse.json(files.map((file) => mapToDriveItem(file, '/')));
    }

    if (folderId === SHARED_DRIVES_SENTINEL) {
      const drives = await loadSharedDrives(client, supabase, user.id);

      return NextResponse.json(drives.map(mapSharedDriveToDriveItem));
    }

    const currentPath = getCurrentPath(folderId);
    const files = await loadDriveFiles(client, folderId, supabase, user.id);

    return NextResponse.json(
      files.map((file) => mapToDriveItem(file, currentPath)),
    );
  } catch (error) {
    if (
      error instanceof GoogleTokenStorageError &&
      error.code === 'missing_table'
    ) {
      return NextResponse.json(GOOGLE_STORAGE_NOT_READY_ERROR, { status: 503 });
    }

    if (
      error instanceof RootFolderStorageError &&
      error.code === 'missing_table'
    ) {
      return NextResponse.json(ROOT_FOLDER_STORAGE_NOT_READY_ERROR, {
        status: 503,
      });
    }

    if (error instanceof GoogleTokenRefreshError) {
      await deleteGoogleTokens(supabase, user.id);

      return NextResponse.json(GOOGLE_RECONNECT_ERROR, { status: 401 });
    }

    if (error instanceof GoogleApiError && error.status === 401) {
      await deleteGoogleTokens(supabase, user.id);

      return NextResponse.json(GOOGLE_RECONNECT_ERROR, { status: 401 });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Could not load Google Drive items.',
      },
      { status: 500 },
    );
  }
}
