import type { ReactNode } from 'react';

const REGEX_ESCAPE_PATTERN = /[.*+?^${}()|[\]\\]/g;

export const highlightMatch = (text: string, query: string): ReactNode => {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length === 0) {
    return text;
  }

  const escapedQuery = normalizedQuery.replace(REGEX_ESCAPE_PATTERN, '\\$&');
  const matcher = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(matcher);

  if (parts.length === 1) {
    return text;
  }

  return parts.map((part, index) => {
    if (part.toLowerCase() !== normalizedQuery.toLowerCase()) {
      return part;
    }

    return (
      <mark
        className="rounded-md bg-(--cmdk-highlight-bg) px-1 py-0.5 font-medium text-(--cmdk-highlight-text)"
        key={`${part}-${index}`}
      >
        {part}
      </mark>
    );
  });
};
