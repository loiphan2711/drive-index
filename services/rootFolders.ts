import type { AddRootFolderBody, RootFolder } from '@/type/rootFolder';

type RootFolderErrorResponse = {
  error?: string;
};

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

const parseRootFolderError = async (response: Response) => {
  try {
    const payload = (await response.json()) as RootFolderErrorResponse;

    return payload.error ?? DEFAULT_ERROR_MESSAGE;
  } catch {
    return DEFAULT_ERROR_MESSAGE;
  }
};

export const fetchRootFolders = async () => {
  const response = await fetch('/api/drive/folders');

  if (!response.ok) {
    throw new Error(await parseRootFolderError(response));
  }

  return (await response.json()) as RootFolder[];
};

export const addRootFolder = async (body: AddRootFolderBody) => {
  const response = await fetch('/api/drive/folders', {
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(await parseRootFolderError(response));
  }

  return (await response.json()) as RootFolder;
};

export const deleteRootFolder = async (id: string) => {
  const response = await fetch(`/api/drive/folders/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await parseRootFolderError(response));
  }
};
