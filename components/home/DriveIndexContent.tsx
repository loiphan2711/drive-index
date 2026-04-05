'use client';

import { useViewMode } from '@/context/useViewMode';

type DriveItem = {
  id: string;
  location: string;
  modifiedAt: string;
  name: string;
  size: string;
  type: 'File' | 'Folder';
};

const DRIVE_ITEMS: DriveItem[] = [
  {
    id: 'design-system',
    location: '/shared/ui',
    modifiedAt: '2 hours ago',
    name: 'Design System',
    size: '18 items',
    type: 'Folder',
  },
  {
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
    id: 'release-checklist',
    location: '/ops/releases',
    modifiedAt: 'Mar 21',
    name: 'Release Checklist.pdf',
    size: '640 KB',
    type: 'File',
  },
];

function DriveItemBadge({ type }: Pick<DriveItem, 'type'>) {
  return (
    <span className="inline-flex rounded-full border border-foreground/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/55">
      {type}
    </span>
  );
}

function DriveGrid({ items }: { items: DriveItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-3xl border border-foreground/10 bg-background/80 p-5 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.35)] backdrop-blur"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold tracking-tight">
                {item.name}
              </p>
              <p className="mt-1 text-sm text-foreground/60">{item.location}</p>
            </div>
            <DriveItemBadge type={item.type} />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-foreground/45">Modified</dt>
              <dd className="mt-1 font-medium">{item.modifiedAt}</dd>
            </div>
            <div>
              <dt className="text-foreground/45">Size</dt>
              <dd className="mt-1 font-medium">{item.size}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

function DriveTable({ items }: { items: DriveItem[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-background/88 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.35)] backdrop-blur">
      <table className="w-full border-collapse text-left">
        <thead className="bg-foreground/[0.03] text-sm text-foreground/55">
          <tr>
            <th className="px-4 py-3 font-medium sm:px-6">Name</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Type</th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">
              Location
            </th>
            <th className="px-4 py-3 font-medium sm:px-6">Modified</th>
            <th className="px-4 py-3 font-medium sm:px-6">Size</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-t border-foreground/8 text-sm text-foreground/75"
            >
              <td className="px-4 py-4 sm:px-6">
                <div className="font-medium text-foreground">{item.name}</div>
              </td>
              <td className="hidden px-4 py-4 md:table-cell">
                <DriveItemBadge type={item.type} />
              </td>
              <td className="hidden px-4 py-4 lg:table-cell">
                {item.location}
              </td>
              <td className="px-4 py-4 sm:px-6">{item.modifiedAt}</td>
              <td className="px-4 py-4 sm:px-6">{item.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DriveIndexContent() {
  const { viewMode } = useViewMode();

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,rgba(23,23,23,0.08),transparent_45%),linear-gradient(180deg,rgba(23,23,23,0.03),transparent_35%)]">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-foreground/10 bg-background/72 p-6 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-foreground/45">
            Indexed overview
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Browse your drive the way you need right now.
              </h2>
              <p className="mt-3 text-base leading-7 text-foreground/65">
                The header stays pinned, search is one shortcut away, and the
                content below responds instantly when you switch between grid
                and table views.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-72">
              <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4">
                <p className="text-foreground/45">Items</p>
                <p className="mt-2 text-2xl font-semibold">126</p>
              </div>
              <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4">
                <p className="text-foreground/45">Shared</p>
                <p className="mt-2 text-2xl font-semibold">38</p>
              </div>
            </div>
          </div>
        </section>

        {viewMode === 'grid' ? (
          <DriveGrid items={DRIVE_ITEMS} />
        ) : (
          <DriveTable items={DRIVE_ITEMS} />
        )}
      </main>
    </div>
  );
}
