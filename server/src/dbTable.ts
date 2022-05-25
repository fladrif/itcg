import { Entity, PrimaryColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

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

  @Column('timestamptz')
  created_at: Date;

  constructor(id: string, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.created_at = new Date();
  }
}

@Entity()
export class Decks {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('json')
  deck_list: Deck;

  @Column('timestamptz')
  created_at: Date;

  @Column('timestamptz')
  modified_at: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'owner_id' })
  owner?: Users;

  constructor(id: string, name: string, deckList: Deck, owner?: Users) {
    this.id = id;
    this.name = name;
    this.deck_list = deckList;
    this.owner = owner;
    this.created_at = new Date();
    this.modified_at = new Date();
  }
}
