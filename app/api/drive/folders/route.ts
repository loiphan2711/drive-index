import type { AddRootFolderBody } from '@/type/rootFolder';

import { NextResponse } from 'next/server';

import {
  addRootFolder,
  getRootFolders,
  RootFolderStorageError,
} from '@/lib/google/rootFolders';
import { createClient } from '@/lib/supabase/server';

const ROOT_FOLDER_STORAGE_NOT_READY_ERROR = {
  code: 'root_folder_storage_not_ready',
  error:
    'Drive root folder storage is missing. Apply the Supabase migration for public.drive_root_folders.',
};

const isValidAddRootFolderBody = (body: unknown): body is AddRootFolderBody =>
  Boolean(
    body &&
    typeof body === 'object' &&
    'folderId' in body &&
    typeof body.folderId === 'string' &&
    body.folderId.trim() &&
    'folderName' in body &&
    typeof body.folderName === 'string' &&
    body.folderName.trim(),
  );

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const folders = await getRootFolders(supabase, user.id);

    return NextResponse.json(folders);
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
            : 'Could not load root folders.',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!isValidAddRootFolderBody(body)) {
    return NextResponse.json(
      { error: 'folderId and folderName are required.' },
      { status: 400 },
    );
  }

  try {
    const folder = await addRootFolder(
      supabase,
      user.id,
      body.folderId.trim(),
      body.folderName.trim(),
    );

    return NextResponse.json(folder, { status: 201 });
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
          error instanceof Error ? error.message : 'Could not add root folder.',
      },
      { status: 500 },
    );
  }
}
