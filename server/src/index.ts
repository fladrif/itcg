import { Server } from 'boardgame.io/server';
import { PostgresStore } from 'bgio-postgres';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
// import Promise from 'bluebird';

import { getRandomKey } from '../../src/utils';
import { ITCG } from '../../src/game';
import { SERVER } from '../../src/config';

import { db } from './db';
import { AUTH_COOKIE_NAME, USER_COOKIE_NAME, setCookies, verify } from './utils';
import { extractAuth } from './auth';
import { CardRouter, DeckRouter, RoomRouter } from './routes';

export interface UserNonce {
  username: string;
  nonce: string;
}

export interface Room {
  id: string;

  owner: string;
  ownerID: string;

  opp?: string;
  oppID?: string;

  ownerDeck?: number;
  oppDeck?: number;
}

const BCRYPT_SALT_ROUNDS = 10;

const gameServerDB = new PostgresStore({
  database: 'itcg',
  username: 'postgres',
  password: 'itcg',
  host: 'localhost',
});

const userNonces: UserNonce[] = [];

const server = Server({
  games: [ITCG],
  origins: [SERVER],
  db: gameServerDB,
});

server.app.use(bodyParser());
server.app.use(cors({ credentials: true }));

server.router.use(['/cards', '/decks', '/games', '/rooms'], extractAuth);

server.router.get('/', (ctx: any) => {
  ctx.body = 'Hey! What are you doing? Stop it!';
});

server.router.post('/login', async (ctx: any) => {
  const { username, passhash } = await verify(ctx, userNonces);

  const usernameUsed = await db.userExist(username);
  if (!usernameUsed) ctx.throw(400, 'Username and password did not match');

  const bcryptPass = await db.getPass(username);
  const result = await bcrypt.compare(passhash, bcryptPass);

  if (!result) ctx.throw(400, 'Username and password did not match');
  const user = await db.getUserByName(username);

  setCookies(ctx, user.username, user.id);
  console.log(`${user.username} logged in`);
});

server.router.post('/signup', async (ctx: any) => {
  const { username, passhash } = await verify(ctx, userNonces);

  const usernameUsed = await db.userExist(username);
  if (usernameUsed) ctx.throw(400, 'Username already used');

  const bcryptPass = await bcrypt.hash(passhash, BCRYPT_SALT_ROUNDS);
  const userID = await db.setUser(username, bcryptPass, uuidv4());

  setCookies(ctx, username, userID);
  console.log(`Registered ${username}`);
});

server.router.get('/logout', (ctx: any) => {
  const username = ctx.cookies.get(USER_COOKIE_NAME);

  ctx.cookies.set(AUTH_COOKIE_NAME);
  ctx.cookies.set(USER_COOKIE_NAME);
  ctx.body = 200;

  console.log(`${username} logged out`);
});

server.router.get('/getNonce', (ctx: any) => {
  const username = ctx.request.query['username'] as string;
  if (!username) ctx.throw(400, 'Username required');

  const nonce = getRandomKey();

  const exists = userNonces.find(
    (un) => un.username.toLowerCase() === username.toLowerCase()
  );
  if (exists) {
    exists.nonce = nonce;
  } else {
    userNonces.push({ username, nonce });
  }

  ctx.body = nonce;
});

server.router.use('/cards', CardRouter.routes());
server.router.use('/decks', DeckRouter.routes());
server.router.use('/rooms', RoomRouter.routes());

server.run(18000);
