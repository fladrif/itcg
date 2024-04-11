import Router from '@koa/router';
import { Server as ServerTypes } from 'boardgame.io';

import * as db from '../db';
import { gameRooms } from '../gameRooms';

const router = new Router<any, ServerTypes.AppCtx>();

router.get('/', async (ctx: any) => {
  ctx.body = 'got stats?';
});

router.get('/users', async (ctx: any) => {
  const userCount = await db.getUserCount();

  ctx.body = userCount;
});

router.get('/users/latest', async (ctx: any) => {
  const latestUsers = await db.getLatestUsers();

  ctx.body = latestUsers;
});

router.get('/decks', async (ctx: any) => {
  const deckCount = await db.getDeckCount();

  ctx.body = deckCount;
});

router.get('/rooms', async (ctx: any) => {
  const rooms = Object.values(gameRooms.rooms).map((rm) => {
    return { p1: rm.users[0].name, p2: rm.users[1]?.name };
  });

  ctx.body = rooms;
});

router.get('/games', async (ctx: any) => {
  const payload = await db.getGames();

  ctx.body = payload;
});

router.get('/games/latest', async (ctx: any) => {
  const payload = await db.getLatestGames();

  ctx.body = payload;
});

export { router as StatsRouter };
