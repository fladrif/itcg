/* Replace with your SQL commands */
create table if not exists "decks"( 
  id uuid PRIMARY KEY,
  name text NOT NULL,
  owner_id uuid,
  deck_list json NOT NULL,
  constraint fk_owner foreign key(owner_id) references users(id)
);
