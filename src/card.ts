import { v4 as uuidv4 } from 'uuid';

import { Action, ActionOpts, ActionTargets } from './actions';

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
}

export interface Monster extends NonCharacter {
  attack: number;
  health: number;
  ability: Ability;
}

export interface Tactic extends NonCharacter {
  ability: Ability;
}

export interface Item extends NonCharacter {
  ability: Ability;
}

export interface SkillRequirements {
  level: number;
  class?: Partial<Record<CardClasses, number>>;
}

export interface Skill {
  requirements: SkillRequirements;
  action: Action;
  activated: boolean;
  opts?: ActionOpts;
  targets?: ActionTargets;
}

export interface Ability {}

export function instantiateCard<T extends Card>(card: Omit<T, 'key'>, num?: number): T[] {
  const name = card.name.replace(' ', '').toLowerCase();
  const instantiatedCards = [];

  num = !num || num < 0 ? 1 : num;
  for (let i = 0; i < num; i++) {
    const randomKey = uuidv4().split('-')[0];
    const key = `${name}-${randomKey}`;
    instantiatedCards.push({ ...(card as T), key });
  }

  return instantiatedCards;
}
