import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { Server as ServerTypes } from 'boardgame.io';

import { AUTH_HEADER } from '../utils';
import * as db from '../db';

const router = new Router<any, ServerTypes.AppCtx>();

router.post('/upsert', bodyParser(), async (ctx: any) => {
  const userID = ctx.header[AUTH_HEADER];

  const settings = ctx.request.body['settings'];
  if (!settings) ctx.throw(400, 'Missing settings');

  await db.saveSettings(userID, settings);

  ctx.body = 200;
});

export { router as SettingsRouter };
