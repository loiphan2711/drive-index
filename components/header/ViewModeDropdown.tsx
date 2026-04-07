'use client';

import type { Key } from 'react';

import { cn, Dropdown } from '@heroui/react';
import { Check, LayoutGrid, Rows3 } from 'lucide-react';
import { startTransition } from 'react';

import { useViewMode } from '@/context/useViewMode';

export const ViewModeDropdown = () => {
  const { viewMode, setViewMode } = useViewMode();
  const itemClassName =
    'rounded-lg px-2 py-1.5 text-sm text-foreground/75 data-[hover=true]:bg-foreground/6 data-[hover=true]:text-foreground data-[selected=true]:text-foreground';

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
        className={cn(
          'flex size-10 items-center justify-center rounded-lg border border-foreground/10',
          'bg-background/70 transition-colors hover:bg-foreground/4',
        )}
      >
        {viewMode === 'grid' ? (
          <LayoutGrid aria-hidden className="size-4" />
        ) : (
          <Rows3 aria-hidden className="size-4" />
        )}
      </Dropdown.Trigger>
      <Dropdown.Popover
        placement="bottom end"
        className={cn(
          'min-w-44 rounded-xl border border-foreground/10',
          'bg-background shadow-[0_8px_32px_-8px_rgba(28,32,43,0.25)] p-1',
        )}
      >
        <Dropdown.Menu
          aria-label="Select view mode"
          onAction={handleAction}
          selectedKeys={new Set([viewMode])}
          selectionMode="single"
          className="bg-transparent p-0"
        >
          <Dropdown.Item
            key="grid"
            id="grid"
            textValue="Grid"
            className={itemClassName}
          >
            <div className="flex w-full items-center gap-2">
              <LayoutGrid aria-hidden className="size-4" />
              <span>Grid</span>
              {viewMode === 'grid' && (
                <Check aria-hidden className="ml-auto size-4 text-[#7107e7]" />
              )}
            </div>
          </Dropdown.Item>
          <Dropdown.Item
            key="table"
            id="table"
            textValue="Table"
            className={itemClassName}
          >
            <div className="flex w-full items-center gap-2">
              <Rows3 aria-hidden className="size-4" />
              <span>Table</span>
              {viewMode === 'table' && (
                <Check aria-hidden className="ml-auto size-4 text-[#7107e7]" />
              )}
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
