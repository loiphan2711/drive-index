import type { FileCategory, FileCategoryStyle } from '@/type/file';
import {
  File,
  FileText,
  FileType,
  FolderOpen,
  Image,
  Sheet,
} from 'lucide-react';

export const FILE_CATEGORY_STYLES: Record<FileCategory, FileCategoryStyle> = {
  document: {
    accent: 'border-t-blue-600 dark:border-t-blue-300',
    color:
      'border-2 border-blue-600 bg-blue-600/15 text-blue-700 dark:border-blue-300 dark:bg-blue-300/15 dark:text-blue-100',
    icon: FileText,
    label: 'Document',
    overlayColor:
      'border-2 border-blue-600 bg-background text-blue-700 dark:border-blue-300 dark:text-blue-100',
  },
  folder: {
    accent: 'border-t-amber-500 dark:border-t-amber-300',
    color:
      'border-2 border-amber-500 bg-amber-500/15 text-amber-700 dark:border-amber-300 dark:bg-amber-300/15 dark:text-amber-100',
    icon: FolderOpen,
    label: 'Folder',
    overlayColor:
      'border-2 border-amber-500 bg-background text-amber-700 dark:border-amber-300 dark:text-amber-100',
  },
  generic: {
    accent: 'border-t-foreground/40',
    color: 'border-2 border-foreground/30 bg-foreground/8 text-foreground/70',
    icon: File,
    label: 'File',
    overlayColor:
      'border-2 border-foreground/30 bg-background text-foreground/70',
  },
  image: {
    accent: 'border-t-primary',
    color: 'border-2 border-primary bg-primary/10 text-primary',
    icon: Image,
    label: 'Image',
    overlayColor: 'border-2 border-primary bg-background text-primary',
  },
  pdf: {
    accent: 'border-t-danger',
    color: 'border-2 border-danger bg-danger/10 text-danger',
    icon: FileType,
    label: 'PDF',
    overlayColor: 'border-2 border-danger bg-background text-danger',
  },
  spreadsheet: {
    accent: 'border-t-accent-green',
    color: 'border-2 border-accent-green bg-accent-green/10 text-accent-green',
    icon: Sheet,
    label: 'Spreadsheet',
    overlayColor:
      'border-2 border-accent-green bg-background text-accent-green',
  },
};
