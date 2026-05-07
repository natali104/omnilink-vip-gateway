-- OmniLink VIP Gateway — Supabase Schema
-- Run this in the Supabase SQL Editor to create the vip_incidents table.

create extension if not exists "pgcrypto";

create table if not exists public.vip_incidents (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  staff_name      text not null,
  client_tier     text not null,
  raw_incident_text text not null,

  -- AI-generated structured fields
  ai_issue_type      text,
  ai_urgency         text check (ai_urgency in ('Low', 'Medium', 'Critical')),
  ai_suggested_action text,
  ai_reasoning       text,
  ai_confidence      numeric,

  -- Human-in-the-loop workflow
  status             text not null default 'Open'
                     check (status in ('Open', 'AI_Approved', 'Human_Overridden', 'Resolved')),
  final_action_taken text,
  resolved_by        text,
  resolved_at        timestamptz
);

-- Index for dashboard queries ordered by recency and urgency
create index if not exists idx_incidents_created_at on public.vip_incidents (created_at desc);
create index if not exists idx_incidents_status on public.vip_incidents (status);

-- Enable Row Level Security (disable for development; add policies for production)
alter table public.vip_incidents enable row level security;

-- Permissive policy for development — replace with role-based policies in production
create policy "Allow all access during development"
  on public.vip_incidents
  for all
  using (true)
  with check (true);

-- Enable Realtime for the vip_incidents table
alter publication supabase_realtime add table public.vip_incidents;
