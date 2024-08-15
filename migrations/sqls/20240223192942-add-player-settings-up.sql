create table if not exists "settings" (
  id uuid PRIMARY KEY,
  settings json NOT NULL,
  created_at timestamptz NOT NULL,
  modified_at timestamptz NOT NULL,
  owner_id uuid,
  constraint fk_owner foreign key(owner_id) references users(id) on delete cascade
);
