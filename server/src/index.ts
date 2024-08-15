import { Server } from 'boardgame.io/server';
import { PostgresStore } from 'bgio-postgres';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { getRandomKey } from '../../src/utils';
import { ITCG } from '../../src/game';
import { CLIENT, SERVER } from '../../src/config';

import * as db from './db';
import { DBConfig } from './config';
import {
  AUTH_COOKIE_NAME,
  USER_COOKIE_NAME,
  setCookies,
  verify,
  validUsername,
  adqLengthUsername,
} from './utils';
import {
  extractAuth,
  serverAuth,
  generateCredentials,
  authenticateCredentials,
  adminAuth,
} from './auth';
import { UserNonce } from './types';
import {
  CardRouter,
  DeckRouter,
  LobbyRouter,
  RoomRouter,
  SettingsRouter,
  StatsRouter,
} from './routes';
const BCRYPT_SALT_ROUNDS = 10;

const gameServerDB = new PostgresStore({
  database: DBConfig.itcgDB,
  username: DBConfig.username,
  password: DBConfig.password,
  host: DBConfig.host,
  port: DBConfig.port,
});

const userNonces: UserNonce[] = [];

const server = Server({
  games: [ITCG],
  origins: [SERVER],
  db: gameServerDB,
  generateCredentials,
  authenticateCredentials,
});

server.app.use(cors({ credentials: true }));

server.router.use(
  ['/cards', '/decks', '/lobby', '/rooms', '/settings', '/stats'],
  extractAuth
);
server.router.use(['/stats'], adminAuth);
server.router.use(['/games'], serverAuth);

server.router.get('/', (ctx: any) => {
  ctx.body = 'Hey! What are you doing? Stop it!';
});

server.router.post('/login', bodyParser(), async (ctx: any) => {
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

server.router.post('/signup', bodyParser(), async (ctx: any) => {
  const { username, passhash } = await verify(ctx, userNonces);

  if (username === undefined) ctx.throw(400, 'Username missing');
  if (!validUsername(username)) ctx.throw(400, 'Username must be alphanumeric');
  if (!adqLengthUsername(username)) ctx.throw(400, 'Username wrong size');

  const usernameUsed = await db.userExist(username);
  if (usernameUsed) ctx.throw(400, 'Username already used');

  const bcryptPass = await bcrypt.hash(passhash, BCRYPT_SALT_ROUNDS);
  const userID = await db.setUser(username, bcryptPass, uuidv4());

  setCookies(ctx, username, userID);
  console.log(`Registered ${username}`);
});

server.router.get('/logout', (ctx: any) => {
  const username = ctx.cookies.get(USER_COOKIE_NAME);

  ctx.cookies.set(AUTH_COOKIE_NAME, undefined, { overwrite: true });
  ctx.cookies.set(USER_COOKIE_NAME, undefined, { domain: CLIENT, overwrite: true });
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
server.router.use('/lobby', LobbyRouter.routes());
server.router.use('/rooms', RoomRouter.routes());
server.router.use('/settings', SettingsRouter.routes());
server.router.use('/stats', StatsRouter.routes());

server.run(18000);
