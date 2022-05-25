alter table "decks" drop column if exists created_at;
alter table "decks" drop column if exists modified_at;

alter table "users" drop column if exists created_at;
