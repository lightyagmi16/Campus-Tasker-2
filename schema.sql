
-- USERS
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  avatar text,
  upi_qr_url text,
  rating numeric default 0,
  tasks_done int default 0,
  earnings bigint default 0,
  created_at timestamptz default now()
);

-- TASKS
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  location text not null,
  tip integer default 0, -- paise (₹ * 100)
  author uuid references users(id),
  assignee uuid references users(id),
  status text default 'open', -- open / accepted / completed
  created_at timestamptz default now()
);

-- MESSAGES
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id),
  author uuid references users(id),
  text text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table tasks enable row level security;
alter table messages enable row level security;

-- Policies
create policy "public_select_tasks" on tasks
  for SELECT using (true);

create policy "insert_own_task" on tasks
  for INSERT with check (auth.uid()::uuid = author);

create policy "update_task_author_or_assignee" on tasks
  for UPDATE using (auth.uid()::uuid = author OR auth.uid()::uuid = assignee)
  with check (auth.uid()::uuid = author OR auth.uid()::uuid = assignee);

create policy "insert_message" on messages
  for INSERT with check (auth.uid()::uuid = author);

create policy "select_messages" on messages
  for SELECT using (true);
