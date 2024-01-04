import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { Server as ServerTypes } from 'boardgame.io';

import { db } from '../db';
import { AUTH_HEADER } from '../utils';
import { gameRooms } from '../gameRooms';
import { inGame, shouldStartGame, startGame } from '../gameServer';

const router = new Router<any, ServerTypes.AppCtx>();

router.get('/', async (ctx: any) => {
  const userID = ctx.header[AUTH_HEADER];

  gameRooms.purgeUnusedRooms();
  const inRoomID = gameRooms.userInRoom(userID);
  const room = inRoomID ? gameRooms.getCleanRoom(inRoomID, userID) : undefined;

  if (!!inRoomID && !!room) return (ctx.body = room);

  const availableRooms = gameRooms.getOpenRooms(userID);

  ctx.body = availableRooms;
});

router.post('/create', async (ctx: any) => {
  const id = ctx.header[AUTH_HEADER];
  const owner = await db.getUserByID(id);

  const userInGame = await inGame(id);
  if (userInGame || gameRooms.userInRoom(id))
    return ctx.throw(400, 'User already in room');

  gameRooms.addRoom({
    name: owner.username,
    id: owner.id,
    owner: true,
    ready: false,
    onlineTS: Date.now(),
  });

  ctx.body = 200;
});

// TODO: return error if startGame fails
router.post('/update', bodyParser(), async (ctx: any) => {
  const id = ctx.header[AUTH_HEADER];

  const deckID = ctx.request.body['deckID'];
  const ready = ctx.request.body['ready'];
  const roomID = ctx.request.body['id'];
  if (!roomID) ctx.throw(400, '13: Please retry submission');

  const room = gameRooms.getRoom(roomID);
  if (!room) return ctx.throw(400, 'Room dne');

  const userIdx = room.users.findIndex((user) => user.id === id);
  if (userIdx < 0) return ctx.throw(400, 'User in room dne');
  if (room.users[userIdx].ready) return ctx.throw(400, 'User ready');

  room.users[userIdx].deck = deckID !== undefined ? deckID : room.users[userIdx].deck;
  room.users[userIdx].ready = ready !== undefined ? ready : room.users[userIdx].ready;

  if (await shouldStartGame(room)) {
    await startGame(room);
    gameRooms.delete(roomID);
  }

  ctx.body = 200;
});

router.post('/join', bodyParser(), async (ctx: any) => {
  const id = ctx.header[AUTH_HEADER];
  const owner = await db.getUserByID(id);

  const roomID = ctx.request.body['id'];
  if (!roomID) ctx.throw(400, '13: Please retry submission');

  const userInGame = await inGame(id);
  if (userInGame || gameRooms.userInRoom(id))
    return ctx.throw(400, 'User already in room');

  const room = gameRooms.getRoom(roomID);
  if (!room) return ctx.throw(400, 'Room dne');

  if (room.users.length >= 2) ctx.throw(400, 'Room Occupied');

  room.users.push({
    name: owner.username,
    id: owner.id,
    owner: false,
    ready: false,
    onlineTS: Date.now(),
  });

  ctx.body = 200;
});

router.post('/leave', bodyParser(), async (ctx: any) => {
  const id = ctx.header[AUTH_HEADER];

  const roomID = ctx.request.body['id'];
  if (!roomID) ctx.throw(400, '13: Please retry submission');

  const room = gameRooms.getRoom(roomID);
  if (!room) return ctx.throw(400, 'Room dne');

  if (room.users.some((user) => user.id === id && user.owner === true)) {
    gameRooms.delete(roomID);
  } else if (room.users.some((user) => user.id === id)) {
    const userIdx = room.users.findIndex((user) => user.owner === false);
    room.users.splice(userIdx, 1);
  }

  ctx.body = 200;
});

export { router as RoomRouter };
