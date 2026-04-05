'use client';

import type { UseOverlayStateReturn } from '@heroui/react';

import { Input, Kbd, Modal } from '@heroui/react';
import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

type SearchModalProps = {
  state: UseOverlayStateReturn;
};

export const SearchModal = ({ state }: SearchModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.isOpen) {
      inputRef.current?.focus();
    }
  }, [state.isOpen]);

  return (
    <Modal state={state}>
      <Modal.Trigger className="flex min-w-0 flex-1 rounded-xl justify-between border border-foreground/10 bg-background/70 px-3 py-2 text-foreground/65 shadow-sm sm:max-w-sm">
        <span className="flex min-w-0 items-center gap-2">
          <Search aria-hidden className="size-4 shrink-0" />
          <span className="truncate">Search files...</span>
        </span>
        <span className="hidden items-center gap-1 text-xs text-foreground/45 sm:flex">
          <Kbd>
            <Kbd.Abbr keyValue="ctrl" />
          </Kbd>
          <Kbd>
            <Kbd.Abbr keyValue="command" />
          </Kbd>
          <Kbd>
            <Kbd.Content>K</Kbd.Content>
          </Kbd>
        </span>
      </Modal.Trigger>
      <Modal.Backdrop isDismissable variant="blur">
        <Modal.Container
          className="px-4 pt-16 sm:px-6 sm:pt-24"
          placement="top"
          size="lg"
        >
          <Modal.Dialog
            aria-label="Search files"
            className="border border-foreground/10 bg-background/95 shadow-2xl"
          >
            <Modal.Header className="items-start gap-3 border-b border-foreground/10 pb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-foreground/5">
                <Search aria-hidden className="size-4 text-foreground/60" />
              </div>
              <div className="flex-1">
                <Modal.Heading>Search files</Modal.Heading>
                <p className="mt-1 text-sm text-foreground/60">
                  Find a file or folder by name or keyword.
                </p>
              </div>
              <Modal.CloseTrigger aria-label="Close search" />
            </Modal.Header>
            <Modal.Body className="pt-5">
              <Input
                aria-label="Search query"
                className="w-full"
                placeholder="Type a filename or keyword..."
                ref={inputRef}
              />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
