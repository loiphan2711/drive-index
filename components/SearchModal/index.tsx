import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { SearchModalDialog } from '@/components/SearchModal/SearchModalDialog';

type SearchModalProps = {
  trigger?: (open: boolean, onOpen: () => void) => ReactNode;
};

const getActiveElement = () => {
  if (typeof document === 'undefined') {
    return null;
  }

  const activeElement = document.activeElement;
  return activeElement instanceof HTMLElement ? activeElement : null;
};

export const SearchModal = ({ trigger }: SearchModalProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  const openSearch = () => {
    lastActiveElementRef.current = getActiveElement();
    setSearchOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!searchOpen && wasOpenRef.current) {
      lastActiveElementRef.current?.focus();
    }

    wasOpenRef.current = searchOpen;
  }, [searchOpen]);

  return (
    <>
      {trigger ? trigger(searchOpen, openSearch) : null}
      <SearchModalDialog onOpenChange={setSearchOpen} open={searchOpen} />
    </>
  );
};
