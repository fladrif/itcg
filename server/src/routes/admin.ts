import Router from '@koa/router';
import { Server as ServerTypes } from 'boardgame.io';

import * as db from '../db';

const router = new Router<any, ServerTypes.AppCtx>();

router.delete('/game/:id', async (ctx: any) => {
  try {
    await db.deleteOngoingGame(ctx.params.id);
  } catch (e) {
    ctx.throw(400, e);
  }

  ctx.body = 200;
});

export { router as AdminRouter };
