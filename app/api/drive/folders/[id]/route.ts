import { NextResponse } from 'next/server';

import {
  deleteRootFolder,
  RootFolderStorageError,
} from '@/lib/google/rootFolders';
import { createClient } from '@/lib/supabase/server';

const ROOT_FOLDER_STORAGE_NOT_READY_ERROR = {
  code: 'root_folder_storage_not_ready',
  error:
    'Drive root folder storage is missing. Apply the Supabase migration for public.drive_root_folders.',
};

type DeleteRootFolderRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _: Request,
  { params }: DeleteRootFolderRouteContext,
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    await deleteRootFolder(supabase, user.id, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof RootFolderStorageError &&
      error.code === 'missing_table'
    ) {
      return NextResponse.json(ROOT_FOLDER_STORAGE_NOT_READY_ERROR, {
        status: 503,
      });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Could not delete root folder.',
      },
      { status: 500 },
    );
  }
}
