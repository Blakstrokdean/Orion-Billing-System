-- Run this file in the Supabase SQL editor.
create extension if not exists pgcrypto;

create table if not exists public.hotspot_sessions (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  device text not null,
  location text not null,
  plan text not null,
  usage text not null default '0 B',
  progress integer not null default 0 check (progress between 0 and 100),
  color text not null default '#317d75',
  connected_at timestamptz not null default now(),
  disconnected_at timestamptz
);

create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  package_name text not null,
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists hotspot_sessions_active_idx
  on public.hotspot_sessions (connected_at desc)
  where disconnected_at is null;

alter table public.hotspot_sessions enable row level security;
alter table public.vouchers enable row level security;

-- Dashboard access is restricted to signed-in operators. Keep the service role
-- key on trusted Edge Functions only; never expose it in the frontend.
create policy "Signed-in operators can view active sessions"
  on public.hotspot_sessions for select to authenticated
  using (disconnected_at is null);

create policy "Signed-in operators can disconnect sessions"
  on public.hotspot_sessions for update to authenticated
  using (disconnected_at is null)
  with check (disconnected_at is not null);

create policy "Signed-in operators can create vouchers"
  on public.vouchers for insert to authenticated
  with check (true);
