import { PlayerID } from 'boardgame.io';

import { Action, ActionOpts, ActionTargets } from './actions';
import { Keyword } from './keywords';
import { Choice } from './stack';
import { GlobalState } from './state';
import { TriggerLifetime, TriggerNames, TriggerOptions } from './triggerStore';
import { getRandomKey } from './utils';

export const BLANK_CARDNAME = 'blank';

export const SAMPLE_SKILL: Skill = {
  requirements: { level: 100 },
  action: 'quest',
  activated: false,
};

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

export interface Card {
  name: string;
  type: CardTypes;
  class: CardClasses;
  owner: PlayerID;
  image: string;
  selected: boolean;
  key: string;
}

export interface Character extends Card {
  health: number;
  skills: Skill[];
}

export interface NonCharacter extends Exclude<Card, Character> {
  level: number;
  skill: Skill;
  ability: Ability;
  reveal?: boolean;
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

export interface SkillRequirements {
  level: number;
  class?: Partial<Record<CardClasses, number>>;
  oneshot?: boolean;
}

export interface Skill {
  requirements: SkillRequirements;
  action: Action;
  activated: boolean;
  noReset?: boolean;
  opts?: ActionOpts;
  targets?: ActionTargets;
  dialogPrompt?: string;
  choice?: Choice[];
}

export interface TriggerRef {
  name: TriggerNames;
  opts?: TriggerOptions;
  lifetime?: TriggerLifetime;
}

export interface Ability {
  triggers?: TriggerRef[];
  skills?: Skill[];
  state?: Omit<GlobalState, 'owner' | 'player'>;
  keywords?: Keyword[];
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

const blankCard: Omit<NonCharacter, 'key' | 'owner'> = {
  type: CardTypes.Monster,
  class: CardClasses.Magician,
  selected: false,
  level: 0,
  name: BLANK_CARDNAME,
  image: '',
  ability: {},
  skill: {
    action: 'optional',
    activated: false,
    requirements: {
      level: 0,
    },
  },
};

export function getBlankCard(owner: string, key: string): NonCharacter {
  return {
    ...blankCard,
    owner,
    key,
  };
}
