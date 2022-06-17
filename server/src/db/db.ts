import { createConnection, Connection } from 'typeorm';

import { Decks, Roles, Userroles, Users } from './dbTable';

import { DBConfig } from '../config';

let connection: Connection;

export async function getConnection(): Promise<Connection> {
  if (connection) return connection;

  connection = await createConnection({
    type: 'postgres',
    host: DBConfig.host,
    port: DBConfig.port,
    username: DBConfig.username,
    password: DBConfig.password,
    database: DBConfig.userDB,
    entities: [Decks, Users, Roles, Userroles],
  });
  return connection;
}
