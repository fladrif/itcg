import EventEmitter from 'events';

import { getRandomKey } from '../../src/utils';

import { Room, RoomUser, CleanRoom } from './types';

const MINUTE = 60 * 1000;
const ROOM_TIMEOUT_MS = 60 * MINUTE;

class GameRooms extends EventEmitter {
  rooms: Record<string, Room>;

  constructor() {
    super();
    this.rooms = {};
  }

  addRoom(user: RoomUser) {
    const id = getRandomKey();

    this.rooms[id] = { id, users: [user] };
    this.emit('create', id, user.name);
  }

  userInRoom(userID: string): string | undefined {
    const roomIDs = Object.keys(this.rooms);

    return roomIDs.find((id) => this.rooms[id].users.some((usr) => usr.id === userID));
  }

  purgeUnusedRooms() {
    const purge = Object.keys(this.rooms).filter(
      (id) =>
        this.rooms[id].users.length < 2 &&
        this.rooms[id].users[0].onlineTS < Date.now() - ROOM_TIMEOUT_MS
    );

    purge.forEach((g) => this.delete(g));
  }

  getOpenRooms(userID: string): CleanRoom[] {
    const roomIDs = Object.keys(this.rooms);

    const openRooms = roomIDs
      .filter((id) => this.rooms[id].users.length < 2)
      .map((id) => {
        return cleanRoom(this.rooms[id], userID);
      });

    return openRooms;
  }

  getCleanRoom(roomID: string, userID: string): CleanRoom | undefined {
    const room = this.rooms[roomID];
    if (!room) return;

    return cleanRoom(room, userID);
  }

  joinRoom(roomID: string, user: Pick<RoomUser, 'id' | 'onlineTS' | 'name'>) {
    const room = this.rooms[roomID];
    if (!room || room.users.length >= 2) return;

    room.users.push({
      name: user.name,
      id: user.id,
      onlineTS: user.onlineTS,
      owner: false,
      ready: false,
    });

    this.emit('join', roomID, user.name);
  }

  leaveRoom(roomID: string, userID: string) {
    const room = this.rooms[roomID];
    const userIdx = room.users.findIndex((user) => user.id === userID);
    room.users.splice(userIdx, 1);

    if (room.users.length <= 0 || !room.users.some((user) => user.owner === true)) {
      this.delete(roomID);
    } else {
      this.emit('leave', roomID);
    }
  }

  getRoom(roomID: string): Room | undefined {
    const room = this.rooms[roomID];
    if (!room) return;

    return room;
  }

  delete(roomID: string, start?: boolean) {
    if (start) this.emit('start', roomID);
    if (!start) this.emit('closed', roomID);

    delete this.rooms[roomID];
  }
}

function cleanRoom(room: Room, userID: string): CleanRoom {
  return {
    id: room.id,
    users: room.users.map((user) => {
      if (user.id === userID) user.onlineTS = Date.now();

      const clean = {
        name: user.name,
        deck: user.deck,
        owner: user.owner,
        ready: user.ready,
        onlineTS: user.onlineTS,
      };

      if (user.id !== userID) delete clean.deck;

      return clean;
    }),
  };
}

export const gameRooms = new GameRooms();
