import Router from '@koa/router';
import { Server as ServerTypes } from 'boardgame.io';

import { cards } from '../../../src/cards';

const router = new Router<any, ServerTypes.AppCtx>();

router.get('/', async (ctx: any) => {
  const { blankCard, ...nonBlankCards } = cards;
  ctx.body = nonBlankCards;
});

export { router as CardRouter };
