create table if not exists public.drive_root_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  folder_id text not null,
  folder_name text not null,
  created_at timestamptz default now()
);

alter table public.drive_root_folders enable row level security;

create policy "Users can only access their own root folders"
  on public.drive_root_folders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create unique index drive_root_folders_user_folder_idx
  on public.drive_root_folders (user_id, folder_id);
