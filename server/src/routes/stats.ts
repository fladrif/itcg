import Router from '@koa/router';
import { Server as ServerTypes } from 'boardgame.io';

import * as db from '../db';

const router = new Router<any, ServerTypes.AppCtx>();

router.get('/', async (ctx: any) => {
  ctx.body = 'got stats?';
});

router.get('/users', async (ctx: any) => {
  const userCount = await db.getUserCount();

  ctx.body = userCount;
});

router.get('/decks', async (ctx: any) => {
  const deckCount = await db.getDeckCount();

  ctx.body = deckCount;
});

export { router as StatsRouter };
