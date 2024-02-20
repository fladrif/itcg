import { createConnection, Connection } from 'typeorm';

import { Decks, Roles, Userroles, Users, Games } from './dbTable';

import { DBConfig } from '../config';

let userConnection: Connection;
let itcgConnection: Connection;

export async function getConnection(): Promise<Connection> {
  if (userConnection) return userConnection;

  userConnection = await createConnection({
    name: 'user',
    type: 'postgres',
    host: DBConfig.host,
    port: DBConfig.port,
    username: DBConfig.username,
    password: DBConfig.password,
    database: DBConfig.userDB,
    entities: [Decks, Users, Roles, Userroles],
  });
  return userConnection;
}

export async function getITCGConnection(): Promise<Connection> {
  if (itcgConnection) return itcgConnection;

  itcgConnection = await createConnection({
    name: 'itcg',
    type: 'postgres',
    host: DBConfig.host,
    port: DBConfig.port,
    username: DBConfig.username,
    password: DBConfig.password,
    database: DBConfig.itcgDB,
    entities: [Games],
  });
  return itcgConnection;
}
