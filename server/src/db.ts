import { createConnection, Connection, ILike } from 'typeorm';

import { Decks, Users } from './dbTable';

import { Deck } from '../../src/game';

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

  async getDecks(userID: string): Promise<Decks[]> {
    if (!this.connection) await this.init();

    const dec = this.connection!.getRepository(Decks);
    const decs = await dec.find({
      relations: ['owner'],
      where: [{ owner: userID }, { owner: null }],
    });

    return decs;
  }

  async getDeck(id: string): Promise<Decks | undefined> {
    if (!this.connection) await this.init();

    const dec = this.connection!.getRepository(Decks);
    const deck = await dec.findOne({ relations: ['owner'], where: { id } });
    return deck;
  }

  async saveDeck(
    id: string,
    name: string,
    deckList: Deck,
    owner?: string
  ): Promise<string> {
    if (!this.connection) await this.init();

    const user = owner ? await this.getUserByID(owner) : undefined;

    const dec = this.connection!.getRepository(Decks);
    await dec.save(new Decks(id, name, deckList, user));

    return id;
  }

  async deleteDeck(deck: Decks): Promise<void> {
    if (!this.connection) await this.init();

    const dec = this.connection!.getRepository(Decks);
    await dec.delete(deck.id);
  }
}

export const db = new DB();
