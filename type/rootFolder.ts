export type RootFolder = {
  id: string;
  folderId: string;
  folderName: string;
  createdAt: string;
};

export type AddRootFolderBody = {
  folderId: string;
  folderName: string;
};
