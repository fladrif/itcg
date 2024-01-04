export interface UserNonce {
  username: string;
  nonce: string;
}

export interface CleanRoomUser {
  name: string;
  owner: boolean;
  ready: boolean;
  onlineTS: number;
  deck?: string;
}

export interface RoomUser extends CleanRoomUser {
  id: string;
}

export interface Room {
  id: string;

  users: RoomUser[];
}

export interface CleanRoom {
  id: string;
  users: CleanRoomUser[];
}
