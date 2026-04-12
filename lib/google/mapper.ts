import type { DriveItem } from '@/type/file';
import type { GoogleDriveFile, GoogleSharedDrive } from '@/type/google';

import { formatFileSize, formatRelativeTime } from '@/utils/format';

const GOOGLE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

const getFileExtension = (file: GoogleDriveFile) => {
  if (file.fileExtension) {
    return file.fileExtension.toLowerCase();
  }

  if (!file.name) {
    return undefined;
  }

  const lastDotIndex = file.name.lastIndexOf('.');

  if (lastDotIndex <= 0 || lastDotIndex === file.name.length - 1) {
    return undefined;
  }

  return file.name.slice(lastDotIndex + 1).toLowerCase();
};

export const mapToDriveItem = (
  file: GoogleDriveFile,
  currentPath: string,
): DriveItem => {
  const isFolder = file.mimeType === GOOGLE_FOLDER_MIME_TYPE;

  return {
    extension: isFolder ? undefined : getFileExtension(file),
    id: file.id ?? crypto.randomUUID(),
    location: currentPath || '/',
    modifiedAt: formatRelativeTime(file.modifiedTime),
    name: file.name?.trim() || 'Untitled',
    size: isFolder
      ? '— items'
      : formatFileSize(file.size ? Number(file.size) : null),
    thumbnailUrl: isFolder ? undefined : (file.thumbnailLink ?? undefined),
    type: isFolder ? 'Folder' : 'File',
  };
};

export const mapSharedDriveToDriveItem = (
  drive: GoogleSharedDrive,
): DriveItem => ({
  extension: undefined,
  id: drive.id ?? crypto.randomUUID(),
  location: '/',
  modifiedAt: '',
  name: drive.name?.trim() || 'Untitled Drive',
  size: '— items',
  thumbnailUrl: undefined,
  type: 'Folder',
});
