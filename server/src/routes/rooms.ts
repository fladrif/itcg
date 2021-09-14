import Router from 'koa-router';
import { Server as ServerTypes } from 'boardgame.io';

import { db } from '../db';
import { Room } from '../index';
import { AUTH_HEADER } from '../utils';

import { getRandomKey } from '../../../src/utils';

const rooms: Room[] = [];

const router = new Router<any, ServerTypes.AppCtx>();

router.get('/', async (ctx: any) => {
  const userID = ctx.header[AUTH_HEADER];

  const inRoom = rooms
    .filter((rm) => rm.ownerID === userID || (rm.oppID && rm.oppID === userID))
    .map((rm) => {
      return { id: rm.id, owner: rm.owner, opp: rm.opp };
    });

  if (inRoom.length > 0) return (ctx.body = inRoom[0]);

  const availableRooms = rooms
    .filter((rm) => !rm.oppID)
    .map((rm) => {
      return { id: rm.id, owner: rm.owner };
    });

  ctx.body = availableRooms;
});

router.post('/create', async (ctx: any) => {
  const id = ctx.header[AUTH_HEADER];
  const owner = await db.getUserByID(id);

  if (rooms.find((rm) => rm.ownerID === owner.id || (rm.oppID && rm.oppID === owner.id)))
    return ctx.throw(400, 'User already in room');

  rooms.push({ id: getRandomKey(), owner: owner.username, ownerID: owner.id });

  ctx.body = 200;
});

router.post('/join', async (ctx: any) => {
  const id = ctx.header[AUTH_HEADER];
  const owner = await db.getUserByID(id);

  const roomID = ctx.request.body['id'];
  if (!roomID) ctx.throw(400, '13: Please retry submission');

  const roomIdx = rooms.findIndex((rm) => rm.id === roomID);
  if (roomIdx < 0) return ctx.throw(400, 'Room dne');

  const room = rooms[roomIdx];
  if (room.opp || room.oppID || room.oppDeck) ctx.throw(400, 'Room Occupied');

  room.opp = owner.username;
  room.oppID = owner.id;

  ctx.body = 200;
});

router.post('/leave', async (ctx: any) => {
  const id = ctx.header[AUTH_HEADER];
  const owner = await db.getUserByID(id);

  const roomID = ctx.request.body['id'];
  if (!roomID) ctx.throw(400, '13: Please retry submission');

  const roomIdx = rooms.findIndex((rm) => rm.id === roomID);
  if (roomIdx < 0) return ctx.throw(400, 'Room dne');

  if (rooms[roomIdx].ownerID === owner.id) {
    rooms.splice(roomIdx, 1);
  } else if (rooms[roomIdx].oppID === owner.id) {
    rooms[roomIdx].oppID = undefined;
    rooms[roomIdx].opp = undefined;
    rooms[roomIdx].oppDeck = undefined;
  }

  ctx.body = 200;
});

export { router as RoomRouter };
