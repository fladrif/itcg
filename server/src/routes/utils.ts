import { Room } from '../types';

export function userInRoom(room: Room, id: string): boolean {
  return room.users.some((user) => user.id === id);
}

export function cleanRoom(room: Room) {
  return {
    id: room.id,
    users: room.users.map((user) => {
      return { name: user.name, deck: user.deck, owner: user.owner };
    }),
  };
}
