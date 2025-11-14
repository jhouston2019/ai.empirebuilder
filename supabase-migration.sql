-- =====================================================
-- AI EMPIRE BUILDER – DATABASE MIGRATION
-- =====================================================
-- Run this in your Supabase SQL Editor

-- Create users table
-- Note: This table uses email as the primary identifier
-- The id column is optional but can be used to link with auth.users if needed
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  plan_tier text, -- NULL = no access, must pay first. Set by webhook after payment.
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table users enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Allow self read/write" on users;
drop policy if exists "Allow service role access" on users;
drop policy if exists "Allow authenticated read" on users;

-- Create policy: Allow users to read their own data by email
create policy "Allow authenticated read" on users
  for select
  using (
    auth.email() = email OR
    auth.uid()::text IN (
      SELECT id::text FROM auth.users WHERE email = users.email
    )
  );

-- Create policy: Allow users to insert their own record
create policy "Allow authenticated insert" on users
  for insert
  with check (
    auth.email() = email
  );

-- Create policy: Allow service role full access (for webhooks)
-- Note: Service role bypasses RLS, but this policy documents the intent
create policy "Allow service role access" on users
  for all
  using (true)
  with check (true);

-- Create index for faster email lookups
create index if not exists users_email_idx on users(email);

-- Create index for plan_tier lookups
create index if not exists users_plan_tier_idx on users(plan_tier);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
drop trigger if exists update_users_updated_at on users;
create trigger update_users_updated_at
  before update on users
  for each row
  execute function update_updated_at_column();

