import Router from '@koa/router';
import { Server as ServerTypes } from 'boardgame.io';

import * as db from '../db';
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

router.get('/ongoing', async (ctx: any) => {
  const ongoingGames = await db.getOngoingGames();

  ctx.body = ongoingGames.map((g) => {
    return {
      title: `${g.players[0].name} vs ${g.players[1].name}`,
      updated_at: g.updatedAt,
      id: g.id,
    };
  });
});

export { router as LobbyRouter };
