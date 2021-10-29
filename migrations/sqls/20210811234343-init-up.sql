/* Replace with your SQL commands */
create extension if not exists "uuid-ossp";
drop table if exists "users";

create table "users" ( 
  id uuid PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password text NOT NULL
);
