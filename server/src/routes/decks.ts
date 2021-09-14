import Router from 'koa-router';
import { Server as ServerTypes } from 'boardgame.io';

import { db } from '../db';
import { AUTH_HEADER } from '../utils';

const router = new Router<any, ServerTypes.AppCtx>();

router.get('/', async (ctx: any) => {
  const userID = ctx.header[AUTH_HEADER];
  const owner = await db.getUserByID(userID);

  console.log(owner);
});

export { router as DeckRouter };
