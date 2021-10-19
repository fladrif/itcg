import Router from 'koa-router';
import { Server as ServerTypes } from 'boardgame.io';

import { getRandomKey } from '../../../src/utils';

import { db } from '../db';
import { Room } from '../types';
import { AUTH_HEADER } from '../utils';

import { cleanRoom, userInRoom } from './utils';

const rooms: Room[] = [];

const router = new Router<any, ServerTypes.AppCtx>();

router.get('/', async (ctx: any) => {
  const userID = ctx.header[AUTH_HEADER];

  const inRoom = rooms.filter((rm) => userInRoom(rm, userID)).map(cleanRoom);

  if (inRoom.length > 0) return (ctx.body = inRoom[0]);

  const availableRooms = rooms.filter((rm) => rm.users.length < 2).map(cleanRoom);

  ctx.body = availableRooms;
});

router.post('/create', async (ctx: any) => {
  const id = ctx.header[AUTH_HEADER];
  const owner = await db.getUserByID(id);

  if (rooms.find((rm) => userInRoom(rm, id)))
    return ctx.throw(400, 'User already in room');

  rooms.push({
    id: getRandomKey(),
    users: [{ name: owner.username, id: owner.id, owner: true }],
  });

  ctx.body = 200;
});

router.post('/update', async (ctx: any) => {
  const id = ctx.header[AUTH_HEADER];

  const deckID = ctx.request.body['deckID'];
  const roomID = ctx.request.body['id'];
  if (!roomID) ctx.throw(400, '13: Please retry submission');

  const roomIdx = rooms.findIndex((rm) => rm.id === roomID);
  if (roomIdx < 0) return ctx.throw(400, 'Room dne');

  const room = rooms[roomIdx];
  const userIdx = room.users.findIndex((user) => user.id === id);
  if (userIdx < 0) return ctx.throw(400, 'User in room dne');

  room.users[userIdx].deck = deckID;

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
  if (room.users.length >= 2) ctx.throw(400, 'Room Occupied');

  room.users.push({ name: owner.username, id: owner.id, owner: false });

  ctx.body = 200;
});

router.post('/leave', async (ctx: any) => {
  const id = ctx.header[AUTH_HEADER];

  const roomID = ctx.request.body['id'];
  if (!roomID) ctx.throw(400, '13: Please retry submission');

  const roomIdx = rooms.findIndex((rm) => rm.id === roomID);
  if (roomIdx < 0) return ctx.throw(400, 'Room dne');

  const room = rooms[roomIdx];

  if (room.users.some((user) => user.id === id && user.owner === true)) {
    rooms.splice(roomIdx, 1);
  } else if (room.users.some((user) => user.id === id)) {
    const userIdx = room.users.findIndex((user) => user.owner === false);
    room.users.splice(userIdx, 1);
  }

  ctx.body = 200;
});

export { router as RoomRouter };
