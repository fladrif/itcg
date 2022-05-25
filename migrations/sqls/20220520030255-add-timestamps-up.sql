alter table "decks" add column created_at timestamptz not null default now();
alter table "decks" add column modified_at timestamptz not null default now();

alter table "users" add column created_at timestamptz not null default now();
