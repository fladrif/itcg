import {
  Entity,
  PrimaryColumn,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Deck, SetupData, PlayerSettings } from '../../../src/game';

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
export class Roles {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'text',
    unique: true,
  })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

@Entity()
export class Userroles {
  @ManyToOne(() => Users, { primary: true })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Roles, { primary: true })
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  constructor(user: Users, role: Roles) {
    this.user = user;
    this.role = role;
  }
}

@Entity()
export class Settings {
  @PrimaryColumn('uuid')
  id: string;

  @Column('json')
  settings: PlayerSettings;

  @Column('timestamptz')
  created_at: Date;

  @Column('timestamptz')
  modified_at: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'owner_id' })
  owner: Users;

  constructor(id: string, settings: PlayerSettings, owner: Users) {
    this.id = id;
    this.settings = settings;
    this.owner = owner;
    this.created_at = new Date();
    this.modified_at = new Date();
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

interface ITCGPlayer {
  id: number;
  name: string;
  credentials: string;
}

interface ITCGPlayers {
  '0': ITCGPlayer;
  '1': ITCGPlayer;
}

interface GameOver {
  winner: string;
}

@Entity('Games')
export class Games {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  gameName: string;

  @Column('json')
  players: ITCGPlayers;

  @Column('json')
  setupData: SetupData;

  @Column('json')
  gameover?: GameOver;

  @Column('timestamptz')
  createdAt: Date;

  @Column('timestamptz')
  updatedAt: Date;

  constructor(
    id: string,
    gameName: string,
    players: ITCGPlayers,
    setupData: SetupData,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.gameName = gameName;
    this.players = players;
    this.setupData = setupData;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
