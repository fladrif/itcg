import Router from '@koa/router';
import { Server as ServerTypes } from 'boardgame.io';

import { AUTH_HEADER, signJWT } from '../utils';
import { inGame } from '../gameServer';

const router = new Router<any, ServerTypes.AppCtx>();

router.get('/inGame', async (ctx: any) => {
  const id = ctx.header[AUTH_HEADER];

  const game = await inGame(id);
  if (!game) return (ctx.body = undefined);

  game.credentials = signJWT(id);
  ctx.body = game;
});

export { router as LobbyRouter };
