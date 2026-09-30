create table if not exists entries (
  id serial primary key,
  name text not null,
  message text not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
