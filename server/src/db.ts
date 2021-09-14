import { createConnection, Connection, ILike } from 'typeorm';
import { Decks, Users } from './dbTable';

export interface User {
  username: string;
  password: string;
  id: string;
}

export class DB {
  connection?: Connection;

  async init() {
    this.connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'itcg',
      database: 'user',
      entities: [Decks, Users],
    });
  }

  async setUser(username: string, password: string, id: string): Promise<string> {
    if (!this.connection) await this.init();

    const user = this.connection!.getRepository(Users);
    await user.save(new Users(id, username, password));

    return id;
  }

  async getUserByID(userID: string): Promise<User> {
    if (!this.connection) await this.init();

    const user = this.connection!.getRepository(Users);
    const thisUser = await user.findOne({ id: userID });

    return thisUser!;
  }

  async getUserByName(username: string): Promise<User> {
    if (!this.connection) await this.init();

    const user = this.connection!.getRepository(Users);
    const thisUser = await user.findOne({ username: ILike(username) });

    return thisUser!;
  }

  async userExist(username: string): Promise<boolean> {
    const thisUser = await this.getUserByName(username);

    if (!thisUser) return false;
    return true;
  }

  async userIDExist(userID: string): Promise<boolean> {
    const thisUser = await this.getUserByID(userID);

    if (!thisUser) return false;
    return true;
  }

  async getPass(username: string): Promise<string> {
    const thisUser = await this.getUserByName(username);

    return thisUser!.password;
  }

  async getUsername(username: string): Promise<string> {
    const thisUser = await this.getUserByName(username);

    return thisUser!.username;
  }

  async verifyUser(userID: string): Promise<boolean> {
    if (!this.connection) await this.init();

    const user = this.connection!.getRepository(Users);
    const thisUser = await user.findOne({ id: userID });

    if (thisUser) return true;
    return false;
  }
}

export const db = new DB();
