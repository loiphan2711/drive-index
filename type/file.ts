import type { LucideIcon } from 'lucide-react';

export type DriveItem = {
  extension?: string;
  id: string;
  location: string;
  modifiedAt: string;
  name: string;
  size: string;
  thumbnailUrl?: string;
  type: 'File' | 'Folder';
};

export type FileCategory =
  | 'document'
  | 'folder'
  | 'generic'
  | 'image'
  | 'pdf'
  | 'spreadsheet';

export type FileCategoryStyle = {
  accent: string;
  color: string;
  icon: LucideIcon;
  label: string;
  overlayColor: string;
};
