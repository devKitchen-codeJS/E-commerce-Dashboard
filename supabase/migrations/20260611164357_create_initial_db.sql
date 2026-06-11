-- ============================================================
-- Migration: create events table for e-commerce analytics
-- Run this in Supabase SQL Editor
-- ============================================================

create table if not exists public.events (
  id          uuid        primary key default gen_random_uuid(),
  type        text        not null check (type in (
                            'page_view',
                            'product_view',
                            'add_to_cart',
                            'checkout_started',
                            'purchase'
                          )),
  timestamp   timestamptz not null default now(),
  session_id  text        not null,
  product_id  text,
  value       numeric,
  meta        jsonb
);

-- Index for time-based queries (most common pattern)
create index if not exists events_timestamp_idx
  on public.events (timestamp desc);

-- Index for session lookups
create index if not exists events_session_idx
  on public.events (session_id);

-- Index for product analytics
create index if not exists events_product_idx
  on public.events (product_id) where product_id is not null;

-- Enable Row Level Security
alter table public.events enable row level security;

-- Allow anonymous reads (dashboard is public)
create policy "Allow anon select"
  on public.events for select
  to anon using (true);

-- Allow anonymous inserts (event generator runs client-side)
create policy "Allow anon insert"
  on public.events for insert
  to anon with check (true);

-- Enable Realtime for this table
alter publication supabase_realtime add table public.events;

-- Optional: auto-cleanup events older than 24h to keep DB lean
-- (uncomment if you want this)
-- create or replace function delete_old_events() returns void as $$
--   delete from public.events where timestamp < now() - interval '24 hours';
-- $$ language sql;
