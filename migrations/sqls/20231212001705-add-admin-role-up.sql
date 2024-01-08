/* Replace with your SQL commands */
create table if not exists "roles" ( 
  id serial PRIMARY KEY,
  name text NOT NULL
);

create table if not exists "userroles" (
  role_id serial,
  user_id uuid,
  constraint fk_role foreign key(role_id) references roles(id),
  constraint fk_user foreign key(user_id) references users(id),
  primary key (role_id, user_id)
);
