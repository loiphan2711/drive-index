import type {
  GoogleAuthenticatedClient,
  GoogleDriveFile,
  GoogleDriveListResponse,
  GoogleSharedDrive,
  GoogleSharedDrivesListResponse,
} from '@/type/google';

const GOOGLE_DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const GOOGLE_DRIVE_DRIVES_URL = 'https://www.googleapis.com/drive/v3/drives';

type GoogleApiErrorResponse =
  | GoogleDriveListResponse
  | GoogleSharedDrivesListResponse;

const getGoogleApiErrorMessage = (
  payload: GoogleApiErrorResponse | null,
  fallback: string,
) => {
  if (!payload?.error) {
    return fallback;
  }

  if (typeof payload.error === 'string') {
    return payload.error;
  }

  return payload.error.message ?? fallback;
};

const parseGoogleDriveResponse = async (
  response: Response,
): Promise<GoogleDriveListResponse | null> => {
  try {
    return (await response.json()) as GoogleDriveListResponse;
  } catch {
    return null;
  }
};

const parseGoogleSharedDrivesResponse = async (
  response: Response,
): Promise<GoogleSharedDrivesListResponse | null> => {
  try {
    return (await response.json()) as GoogleSharedDrivesListResponse;
  } catch {
    return null;
  }
};

export class GoogleApiError extends Error {
  info: GoogleApiErrorResponse | null;
  status: number;

  constructor(
    message: string,
    status: number,
    info: GoogleApiErrorResponse | null,
  ) {
    super(message);
    this.name = 'GoogleApiError';
    this.info = info;
    this.status = status;
  }
}

export const listDriveItems = async (
  auth: GoogleAuthenticatedClient,
  folderId: string,
) => {
  const url = new URL(GOOGLE_DRIVE_FILES_URL);

  url.searchParams.set(
    'fields',
    'files(id,name,mimeType,modifiedTime,size,thumbnailLink,fileExtension)',
  );
  url.searchParams.set('includeItemsFromAllDrives', 'true');
  url.searchParams.set('orderBy', 'folder,name');
  url.searchParams.set('pageSize', '100');
  url.searchParams.set('q', `'${folderId}' in parents and trashed = false`);
  url.searchParams.set('supportsAllDrives', 'true');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
    },
    cache: 'no-store',
  });

  const payload = await parseGoogleDriveResponse(response);

  if (!response.ok || !payload) {
    throw new GoogleApiError(
      getGoogleApiErrorMessage(payload, 'Could not load Google Drive items.'),
      response.status,
      payload,
    );
  }

  return (payload.files ?? []) as GoogleDriveFile[];
};

export const listSharedDrives = async (
  auth: GoogleAuthenticatedClient,
): Promise<GoogleSharedDrive[]> => {
  const url = new URL(GOOGLE_DRIVE_DRIVES_URL);

  url.searchParams.set('fields', 'drives(id,name,kind)');
  url.searchParams.set('pageSize', '100');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
    },
    cache: 'no-store',
  });

  const payload = await parseGoogleSharedDrivesResponse(response);

  if (!response.ok || !payload) {
    throw new GoogleApiError(
      getGoogleApiErrorMessage(payload, 'Could not load Shared Drives.'),
      response.status,
      payload,
    );
  }

  return (payload.drives ?? []) as GoogleSharedDrive[];
};

export const listSharedWithMe = async (
  auth: GoogleAuthenticatedClient,
): Promise<GoogleDriveFile[]> => {
  const url = new URL(GOOGLE_DRIVE_FILES_URL);

  url.searchParams.set(
    'fields',
    'files(id,name,mimeType,modifiedTime,size,thumbnailLink,fileExtension)',
  );
  url.searchParams.set('includeItemsFromAllDrives', 'true');
  url.searchParams.set('orderBy', 'folder,name');
  url.searchParams.set('pageSize', '100');
  url.searchParams.set('q', 'sharedWithMe = true and trashed = false');
  url.searchParams.set('supportsAllDrives', 'true');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
    },
    cache: 'no-store',
  });

  const payload = await parseGoogleDriveResponse(response);

  if (!response.ok || !payload) {
    throw new GoogleApiError(
      getGoogleApiErrorMessage(payload, 'Could not load Shared with Me items.'),
      response.status,
      payload,
    );
  }

  return (payload.files ?? []) as GoogleDriveFile[];
};

export const searchDriveItems = async (
  auth: GoogleAuthenticatedClient,
  query: string,
): Promise<GoogleDriveFile[]> => {
  const sanitizedQuery = query.replace(/'/g, "\\'");
  const url = new URL(GOOGLE_DRIVE_FILES_URL);

  url.searchParams.set(
    'fields',
    'files(id,name,mimeType,modifiedTime,size,thumbnailLink,fileExtension)',
  );
  url.searchParams.set('includeItemsFromAllDrives', 'true');
  url.searchParams.set('orderBy', 'folder,name');
  url.searchParams.set('pageSize', '100');
  url.searchParams.set(
    'q',
    `name contains '${sanitizedQuery}' and trashed = false`,
  );
  url.searchParams.set('supportsAllDrives', 'true');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
    },
    cache: 'no-store',
  });

  const payload = await parseGoogleDriveResponse(response);

  if (!response.ok || !payload) {
    throw new GoogleApiError(
      getGoogleApiErrorMessage(payload, 'Could not search Google Drive.'),
      response.status,
      payload,
    );
  }

  return (payload.files ?? []) as GoogleDriveFile[];
};
