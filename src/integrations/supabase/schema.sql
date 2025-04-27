-- Create exam_results table
create table public.exam_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  test_id text not null,
  score numeric not null,
  total_questions integer not null,
  type text not null check (type in ('verbal', 'quantitative', 'mixed')),
  questions_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.exam_results enable row level security;

-- Create policy to allow users to read only their own results
create policy "Users can read their own results"
  on public.exam_results
  for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own results
create policy "Users can insert their own results"
  on public.exam_results
  for insert
  with check (auth.uid() = user_id);

-- Create index for faster queries
create index exam_results_user_id_idx on public.exam_results(user_id);
create index exam_results_created_at_idx on public.exam_results(created_at desc); 
