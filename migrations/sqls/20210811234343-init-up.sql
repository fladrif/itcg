/* Replace with your SQL commands */
create extension if not exists "uuid-ossp";

create table if not exists "users" ( 
  id uuid PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password text NOT NULL
);
