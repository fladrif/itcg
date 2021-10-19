export interface UserNonce {
  username: string;
  nonce: string;
}

export interface RoomUser {
  id: string;
  name: string;
  owner: boolean;
  deck?: string;
}

export interface Room {
  id: string;

  users: RoomUser[];
}
