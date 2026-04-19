-- Steph's Grad Party — database schema
-- Run this in the Supabase SQL editor on a fresh project.

create table if not exists photos (
  id bigserial primary key,
  url text not null,
  caption text,
  name text not null default 'anonymous',
  rotation real not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists photos_created_at_idx on photos (created_at desc);

create table if not exists guestbook_entries (
  id bigserial primary key,
  name text not null default 'anonymous',
  message text not null,
  rotation real not null default 0,
  accent boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists guestbook_created_at_idx
  on guestbook_entries (created_at desc);

create table if not exists memories (
  id bigserial primary key,
  prompt text,
  body text not null,
  author text not null default 'anonymous',
  created_at timestamptz not null default now()
);
create index if not exists memories_created_at_idx on memories (created_at desc);

create table if not exists songs (
  id bigserial primary key,
  title text not null,
  artist text,
  requested_by text not null default 'anonymous',
  created_at timestamptz not null default now()
);
create index if not exists songs_created_at_idx on songs (created_at desc);

create table if not exists rate_log (
  ip inet not null,
  kind text not null,
  at timestamptz not null default now()
);
create index if not exists rate_log_ip_kind_at_idx on rate_log (ip, kind, at desc);

-- RLS: public SELECT only; writes go through the service role in API routes.
alter table photos enable row level security;
alter table guestbook_entries enable row level security;
alter table memories enable row level security;
alter table songs enable row level security;
alter table rate_log enable row level security;

drop policy if exists "public read photos" on photos;
drop policy if exists "public read guestbook" on guestbook_entries;
drop policy if exists "public read memories" on memories;
drop policy if exists "public read songs" on songs;

create policy "public read photos" on photos for select using (true);
create policy "public read guestbook" on guestbook_entries for select using (true);
create policy "public read memories" on memories for select using (true);
create policy "public read songs" on songs for select using (true);
-- rate_log has no public read policy on purpose.
