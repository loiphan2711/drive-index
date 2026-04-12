'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { useGoogleConnection } from '@/hooks/useGoogleConnection';
import { useRootFolders } from '@/hooks/useRootFolders';
import { addRootFolder } from '@/services/rootFolders';

import { ConnectionCard } from './ConnectionCard';
import { FolderPickerModal } from './FolderPickerModal';
import { RootFoldersCard } from './RootFoldersCard';

export const DashboardConfig = () => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerInstanceKey, setPickerInstanceKey] = useState(0);
  const { data: connection } = useGoogleConnection();
  const { mutate: mutateRootFolders } = useRootFolders();

  const handleOpenFolderPicker = () => {
    if (!connection?.connected) {
      toast.error('Connect Google Drive before adding folders.');
      return;
    }

    setPickerInstanceKey((current) => current + 1);
    setIsPickerOpen(true);
  };

  const handleFolderSelect = async (folderId: string, folderName: string) => {
    await addRootFolder({ folderId, folderName });
    await mutateRootFolders();
    setIsPickerOpen(false);
    toast.success(`Saved ${folderName} as a root folder.`);
  };

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <ConnectionCard />
        <RootFoldersCard onAddFolder={handleOpenFolderPicker} />
      </div>

      <FolderPickerModal
        key={pickerInstanceKey}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleFolderSelect}
        open={isPickerOpen}
      />
    </>
  );
};
