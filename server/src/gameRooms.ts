import { getRandomKey } from '../../src/utils';

import { Room, RoomUser, CleanRoom } from './types';

const MINUTE = 60 * 1000;
const ROOM_TIMEOUT_MS = 60 * MINUTE;

class GameRooms {
  rooms: Record<string, Room>;

  constructor() {
    this.rooms = {};
  }

  addRoom(user: RoomUser) {
    const id = getRandomKey();

    this.rooms[id] = { id, users: [user] };
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

    purge.map((id) => delete this.rooms[id]);
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

  getRoom(roomID: string): Room | undefined {
    const room = this.rooms[roomID];
    if (!room) return;

    return room;
  }

  delete(roomID: string) {
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
