import type { SupabaseClient } from '@supabase/supabase-js';
import type { RootFolder } from '@/type/rootFolder';

const ROOT_FOLDERS_TABLE = 'drive_root_folders';
const MISSING_ROOT_FOLDERS_TABLE_MESSAGE =
  "Could not find the table 'public.drive_root_folders' in the schema cache";

type RootFolderRow = {
  created_at: string;
  folder_id: string;
  folder_name: string;
  id: string;
  user_id: string;
};

const mapRowToRootFolder = (row: RootFolderRow): RootFolder => ({
  createdAt: row.created_at,
  folderId: row.folder_id,
  folderName: row.folder_name,
  id: row.id,
});

export class RootFolderStorageError extends Error {
  code: 'missing_table' | 'unknown';

  constructor(message: string, code: 'missing_table' | 'unknown' = 'unknown') {
    super(message);
    this.name = 'RootFolderStorageError';
    this.code = code;
  }
}

const toRootFolderStorageError = (error: {
  code?: string | null;
  message: string;
}) => {
  if (
    error.code === 'PGRST205' ||
    error.message.includes(MISSING_ROOT_FOLDERS_TABLE_MESSAGE) ||
    error.message.includes(
      'relation "public.drive_root_folders" does not exist',
    )
  ) {
    return new RootFolderStorageError(
      'Drive root folder storage is not set up yet. Run the Supabase migration for public.drive_root_folders.',
      'missing_table',
    );
  }

  return new RootFolderStorageError(error.message);
};

export const getRootFolders = async (
  supabaseClient: SupabaseClient,
  userId: string,
): Promise<RootFolder[]> => {
  const { data, error } = await supabaseClient
    .from(ROOT_FOLDERS_TABLE)
    .select('id, folder_id, folder_name, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    throw toRootFolderStorageError(error);
  }

  return ((data ?? []) as RootFolderRow[]).map(mapRowToRootFolder);
};

export const addRootFolder = async (
  supabaseClient: SupabaseClient,
  userId: string,
  folderId: string,
  folderName: string,
): Promise<RootFolder> => {
  const payload = {
    folder_id: folderId,
    folder_name: folderName,
    user_id: userId,
  };
  const { data, error } = await supabaseClient
    .from(ROOT_FOLDERS_TABLE)
    .upsert(payload, { onConflict: 'user_id,folder_id' })
    .select('id, folder_id, folder_name, created_at')
    .single();

  if (error) {
    throw toRootFolderStorageError(error);
  }

  return mapRowToRootFolder(data as RootFolderRow);
};

export const deleteRootFolder = async (
  supabaseClient: SupabaseClient,
  userId: string,
  id: string,
) => {
  const { error } = await supabaseClient
    .from(ROOT_FOLDERS_TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw toRootFolderStorageError(error);
  }
};

export const getRootFolderIds = async (
  supabaseClient: SupabaseClient,
  userId: string,
) => {
  const folders = await getRootFolders(supabaseClient, userId);

  return folders.map((folder) => folder.folderId);
};
