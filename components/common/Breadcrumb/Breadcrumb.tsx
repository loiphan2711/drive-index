'use client';

import type { ReactNode } from 'react';

import { Breadcrumbs, cn } from '@heroui/react';

import { breadcrumbVariants } from './variants';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
};

export const Breadcrumb = ({
  items,
  separator = '/',
  className,
}: BreadcrumbProps) => {
  const styles = breadcrumbVariants();

  return (
    <nav aria-label="Breadcrumb" className={cn(styles.base(), className)}>
      <Breadcrumbs
        className={styles.list()}
        separator={
          <span aria-hidden>
            <span className={styles.separator()}>{separator}</span>
          </span>
        }
      >
        {items.map((item, index) => (
          <Breadcrumbs.Item
            key={`${item.label}-${index}`}
            href={item.href}
            className={({ isCurrent }) =>
              cn(
                styles.item(),
                isCurrent
                  ? '[&_.breadcrumbs__link]:cursor-default [&_.breadcrumbs__link]:font-semibold [&_.breadcrumbs__link]:text-foreground'
                  : item.href
                    ? '[&_.breadcrumbs__link]:text-foreground/60 [&_.breadcrumbs__link]:transition-colors [&_.breadcrumbs__link:hover]:text-primary'
                    : '[&_.breadcrumbs__link]:text-foreground/60',
              ) ?? ''
            }
          >
            {item.label}
          </Breadcrumbs.Item>
        ))}
      </Breadcrumbs>
    </nav>
  );
};
