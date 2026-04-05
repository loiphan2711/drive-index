'use client';

import type { Key } from 'react';

import { Dropdown } from '@heroui/react';
import { LayoutGrid, Rows3 } from 'lucide-react';
import { startTransition } from 'react';

import { useViewMode } from '@/context/useViewMode';

export const ViewModeDropdown = () => {
  const { viewMode, setViewMode } = useViewMode();

  const handleAction = (key: Key) => {
    if (key === 'grid' || key === 'table') {
      startTransition(() => {
        setViewMode(key);
      });
    }
  };

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label={`Current view mode: ${viewMode}. Click to change.`}
        className="flex size-10 items-center justify-center rounded-xl border border-foreground/10 bg-background/70 transition-colors hover:bg-foreground/4"
      >
        {viewMode === 'grid' ? (
          <LayoutGrid aria-hidden className="size-4" />
        ) : (
          <Rows3 aria-hidden className="size-4" />
        )}
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          aria-label="Select view mode"
          onAction={handleAction}
          selectedKeys={new Set([viewMode])}
          selectionMode="single"
        >
          <Dropdown.Item id="grid" textValue="Grid">
            <div className="flex items-center gap-2">
              <LayoutGrid aria-hidden className="size-4" />
              <span>Grid</span>
            </div>
          </Dropdown.Item>
          <Dropdown.Item id="table" textValue="Table">
            <div className="flex items-center gap-2">
              <Rows3 aria-hidden className="size-4" />
              <span>Table</span>
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
