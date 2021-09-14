import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';

import { Deck } from '../../src/game';

@Entity()
export class Users {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(() => Decks, (decks) => decks.owner)
  decks: Decks[];

  constructor(id: string, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.decks = [];
  }
}

@Entity()
export class Decks {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @ManyToOne(() => Users, (users) => users.decks)
  owner: Users;

  @Column('json')
  deck_list: Deck;

  constructor(id: string, username: string, owner: Users, deckList: Deck) {
    this.id = id;
    this.name = username;
    this.owner = owner;
    this.deck_list = deckList;
  }
}
