create table if not exists public.google_tokens (
  user_id uuid primary key references auth.users(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  expiry_date bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.google_tokens enable row level security;

drop policy if exists "Users can only access their own tokens" on public.google_tokens;

create policy "Users can only access their own tokens"
  on public.google_tokens
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
