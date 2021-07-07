import { Action, ActionOpts, ActionTargets } from './actions';
import { getRandomKey } from './utils';

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
  attacks: number;
  damage: number;
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
  turn?: number;
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
    const randomKey = getRandomKey();
    const key = `${name}-${randomKey}`;
    instantiatedCards.push({ ...(card as T), key });
  }

  return instantiatedCards;
}

export function isMonster(card: Character | NonCharacter): card is Monster {
  if (card.type === CardTypes.Monster) return true;

  return false;
}

export function isCharacter(card: Character | NonCharacter): card is Character {
  if (card.type === CardTypes.Character) return true;

  return false;
}
