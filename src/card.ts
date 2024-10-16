import { PlayerID } from 'boardgame.io';

import { Keyword } from './keywords';
import { GlobalState } from './state';
import { TriggerLifetimeTemplate, TriggerNames, TriggerOptions } from './trigger';
import { getRandomKey } from './utils';
import { CardName } from './cards';
import { SkillRef } from './skill';
import { skillRef } from './skill/utils';

export const BLANK_CARDNAME = 'blank';

export enum CardTypes {
  Tactic = 'Tactic',
  Item = 'Item',
  Monster = 'Monster',
  Character = 'Character',
}

export enum CardClasses {
  Bowman = 'Bowman',
  Magician = 'Magician',
  Thief = 'Thief',
  Warrior = 'Warrior',
}

export enum Set {
  one = 'Set 1',
  two = 'Set 2',
  three = 'Set 3',
  four = 'Set 4',
  five = 'Set 5',
  six = 'Set 6',
  promo = 'Promo',
}

export enum CardSubTypes {
  strategy = 'strategy',
  skill = 'skill',
  armor = 'armor',
  shield = 'shield',
  wand = 'wand',
  weapon = 'weapon',
  flying = 'flying',
  dark = 'dark',
  fire = 'fire',
  ice = 'ice',
  water = 'water',
  undead = 'undead',
  mechanical = 'mechanical',
  king = 'king',
  flora = 'flora',
  guardian = 'guardian',
  clown = 'clown',
  dog = 'dog',
  alien = 'alien',
  beast = 'beast',
  reptile = 'reptile',
  worm = 'worm',
  dragon = 'dragon',
  fairy = 'fairy',
  boar = 'boar',
  mushroom = 'mushroom',
  pest = 'pest',
  bear = 'bear',
  wolf = 'wolf',
  spook = 'spook',
  fish = 'fish',
  shrimp = 'shrimp',
  kitty = 'kitty',
  crab = 'crab',
  soldier = 'soldier',
  monkey = 'monkey',
  bird = 'bird',
  toy = 'toy',
  goo = 'goo',
  bat = 'bat',
  bull = 'bull',
  human = 'human',
  boss = 'boss',
}

export interface Card {
  canonicalName: CardName;
  name: string;
  type: CardTypes;
  class: CardClasses;
  owner: PlayerID;
  image: string;
  selected: boolean;
  key: string;
  set: Set;
}

export interface Character extends Card {
  health: number;
  skills: SkillRef[];
}

export interface NonCharacter extends Exclude<Card, Character> {
  subtypes: CardSubTypes[];
  level: number;
  skill: SkillRef;
  ability: Ability;
  reveal?: PlayerID[];
}

export interface Monster extends NonCharacter {
  health: number;
  attacks: number;
  attack: number;
  damageTaken: number;
  turnETB?: number;
}

export interface Tactic extends NonCharacter {}

export interface Item extends NonCharacter {
  turnETB?: number;
}
export interface TriggerRef {
  name: TriggerNames;
  opts?: TriggerOptions;
  lifetime?: TriggerLifetimeTemplate;
}

export interface Ability {
  triggers?: TriggerRef[];
  skills?: SkillRef;
  state?: Omit<GlobalState, 'owner' | 'player'>;
  keywords?: Keyword[];
  inactiveKeywords?: Keyword[];
}

export function instantiateCard<T extends Card>(
  card: Omit<T, 'key' | 'owner'>,
  player: PlayerID,
  num?: number
): T[] {
  const name = card.name.replace(' ', '').toLowerCase();
  const instantiatedCards = [];

  num = !num || num < 0 ? 1 : num;
  for (let i = 0; i < num; i++) {
    const randomKey = getRandomKey();
    const key = `${name}-${randomKey}`;
    instantiatedCards.push({ ...(card as T), key, owner: player });
  }

  return instantiatedCards;
}

export function isItem(card: Character | NonCharacter): card is Item {
  if (card.type === CardTypes.Item) return true;

  return false;
}

export function isMonster(card: Character | NonCharacter): card is Monster {
  if (card.type === CardTypes.Monster) return true;

  return false;
}

export function isTactic(card: Character | NonCharacter): card is Tactic {
  if (card.type === CardTypes.Tactic) return true;

  return false;
}

export function isCharacter(card: Character | NonCharacter): card is Character {
  if (card.type === CardTypes.Character) return true;

  return false;
}

export function isWarrior(card: Character | NonCharacter): boolean {
  if (card.class === CardClasses.Warrior) return true;

  return false;
}

export const blankCard: Omit<NonCharacter, 'key' | 'owner'> = {
  canonicalName: 'blankCard',
  type: CardTypes.Monster,
  class: CardClasses.Magician,
  set: Set.promo,
  selected: false,
  level: 0,
  name: BLANK_CARDNAME,
  image: '',
  ability: {},
  skill: skillRef('blank'),
  subtypes: [],
};

export function getBlankCard(owner: string, key: string): NonCharacter {
  return {
    ...blankCard,
    owner,
    key,
  };
}
