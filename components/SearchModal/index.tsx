import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { SearchModalDialog } from '@/components/SearchModal/SearchModalDialog';

type SearchModalProps = {
  trigger?: (open: boolean) => ReactNode;
};

export const SearchModal = ({ trigger }: SearchModalProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = () => {
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

  return (
    <SearchModalDialog
      onOpenChange={setSearchOpen}
      open={searchOpen}
      trigger={trigger}
    />
  );
};
