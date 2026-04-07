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
    accent: 'border-t-blue-600/55 dark:border-t-blue-300/45',
    color:
      'border-blue-600/25 bg-blue-600/12 text-blue-700 dark:border-blue-300/30 dark:bg-blue-300/14 dark:text-blue-100',
    icon: FileText,
    label: 'Document',
    overlayColor:
      'border-blue-600/25 text-blue-700 dark:border-blue-300/30 dark:text-blue-100',
  },
  folder: {
    accent: 'border-t-amber-500/55 dark:border-t-amber-300/45',
    color:
      'border-amber-500/25 bg-amber-500/12 text-amber-700 dark:border-amber-300/30 dark:bg-amber-300/14 dark:text-amber-100',
    icon: FolderOpen,
    label: 'Folder',
    overlayColor:
      'border-amber-500/25 text-amber-700 dark:border-amber-300/30 dark:text-amber-100',
  },
  generic: {
    accent: 'border-t-slate-500/40 dark:border-t-slate-300/35',
    color:
      'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:border-slate-300/25 dark:bg-slate-300/12 dark:text-slate-100',
    icon: File,
    label: 'File',
    overlayColor:
      'border-slate-500/20 text-slate-700 dark:border-slate-300/25 dark:text-slate-100',
  },
  image: {
    accent: 'border-t-purple-600/55 dark:border-t-purple-300/45',
    color:
      'border-purple-600/25 bg-purple-600/12 text-purple-700 dark:border-purple-300/30 dark:bg-purple-300/14 dark:text-purple-100',
    icon: Image,
    label: 'Image',
    overlayColor:
      'border-purple-600/25 text-purple-700 dark:border-purple-300/30 dark:text-purple-100',
  },
  pdf: {
    accent: 'border-t-red-600/55 dark:border-t-red-300/45',
    color:
      'border-red-600/25 bg-red-600/12 text-red-700 dark:border-red-300/30 dark:bg-red-300/14 dark:text-red-100',
    icon: FileType,
    label: 'PDF',
    overlayColor:
      'border-red-600/25 text-red-700 dark:border-red-300/30 dark:text-red-100',
  },
  spreadsheet: {
    accent: 'border-t-green-600/55 dark:border-t-green-300/45',
    color:
      'border-green-600/25 bg-green-600/12 text-green-700 dark:border-green-300/30 dark:bg-green-300/14 dark:text-green-100',
    icon: Sheet,
    label: 'Spreadsheet',
    overlayColor:
      'border-green-600/25 text-green-700 dark:border-green-300/30 dark:text-green-100',
  },
};
