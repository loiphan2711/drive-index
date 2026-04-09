'use client';

import type { DriveItem } from '@/type/file';
import useSWR from 'swr';

import { fetchDriveItems } from '@/services/drive';

const FALLBACK_DRIVE_ITEMS: DriveItem[] = [
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

export const useDriveItems = () =>
  useSWR<DriveItem[], Error>(null, fetchDriveItems, {
    fallbackData: FALLBACK_DRIVE_ITEMS,
  });
