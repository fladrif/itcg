import Router from '@koa/router';
import { Server as ServerTypes } from 'boardgame.io';

import * as cards from '../../../src/cards';

const router = new Router<any, ServerTypes.AppCtx>();

router.get('/', async (ctx: any) => {
  ctx.body = cards;
});

export { router as CardRouter };
