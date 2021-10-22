import { getRandomKey } from '../../src/utils';

import { Room, RoomUser, CleanRoom } from './types';

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

  getOpenRooms(): CleanRoom[] {
    const roomIDs = Object.keys(this.rooms);

    const openRooms = roomIDs
      .filter((id) => this.rooms[id].users.length < 2)
      .map((id) => {
        return cleanRoom(this.rooms[id]);
      });

    return openRooms;
  }

  getCleanRoom(roomID: string): CleanRoom | undefined {
    const room = this.rooms[roomID];
    if (!room) return;

    return cleanRoom(room);
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

function cleanRoom(room: Room): CleanRoom {
  return {
    id: room.id,
    users: room.users.map((user) => {
      return { name: user.name, deck: user.deck, owner: user.owner, ready: user.ready };
    }),
  };
}

export const gameRooms = new GameRooms();
