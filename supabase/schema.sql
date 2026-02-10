-- Create a table for public profiles (optional, but good practice)
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for saved projections
create table if not exists projections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null, -- e.g., "Escenario Centro Comercial"
  
  -- Inputs (Stored as JSONB for flexibility or columns for strictness)
  -- Storing as JSONB is easier for a calculator that might change inputs
  data jsonb not null,
  
  -- Key metrics cache
  net_monthly_profit numeric,
  roi_months numeric,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Projections
alter table projections enable row level security;

create policy "Users can CRUD their own projections." on projections
  for all using (auth.uid() = user_id);
