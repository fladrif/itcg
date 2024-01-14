import { ILike } from 'typeorm';

import { getConnection } from './db';
import { Users } from './dbTable';

interface User {
  username: string;
  password: string;
  id: string;
  created_at: Date;
}

interface UserCount {
  created_at: Date;
}

export async function getUserCount(): Promise<UserCount[]> {
  const connection = await getConnection();

  const user = connection.getRepository(Users);
  return user.find({ select: ['created_at'] });
}

export async function getLatestUsers(): Promise<any[]> {
  const connection = await getConnection();

  const user = connection.getRepository(Users);
  return user.find({
    select: ['username', 'created_at'],
    take: 3,
    order: { created_at: 'DESC' },
  });
}

export async function setUser(
  username: string,
  password: string,
  id: string
): Promise<string> {
  const connection = await getConnection();

  const user = connection.getRepository(Users);
  await user.save(new Users(id, username, password));

  return id;
}

export async function getUserByID(userID: string): Promise<User> {
  const connection = await getConnection();

  const user = connection!.getRepository(Users);
  const thisUser = await user.findOne({ id: userID });

  return thisUser!;
}

export async function getUserByName(username: string): Promise<User> {
  const connection = await getConnection();

  const user = connection!.getRepository(Users);
  const thisUser = await user.findOne({ username: ILike(username) });

  return thisUser!;
}

export async function userExist(username: string): Promise<boolean> {
  const thisUser = await getUserByName(username);

  if (!thisUser) return false;
  return true;
}

export async function userIDExist(userID: string): Promise<boolean> {
  const thisUser = await getUserByID(userID);

  if (!thisUser) return false;
  return true;
}

export async function getPass(username: string): Promise<string> {
  const thisUser = await getUserByName(username);

  return thisUser!.password;
}

export async function getUsername(username: string): Promise<string> {
  const thisUser = await getUserByName(username);

  return thisUser!.username;
}

export async function verifyUser(userID: string): Promise<boolean> {
  const connection = await getConnection();

  const user = connection!.getRepository(Users);
  const thisUser = await user.findOne({ id: userID });

  if (thisUser) return true;
  return false;
}
