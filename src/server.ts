import { Server } from 'boardgame.io/server';
import { ITCG } from './game';
import { PostgresStore } from 'bgio-postgres';

const db = new PostgresStore({
  database: 'postgres',
  username: 'postgres',
  password: 'itcg',
  host: 'itcg-db',
});

const server = Server({
  games: [ITCG],
  db,
});

server.run(18000);
