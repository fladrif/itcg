import { Action, ActionOpts, ActionTargets } from './actions';

export const SAMPLE_SKILL: Skill = {
  requirements: { level: 100 },
  action: 'quest',
  activated: false,
};

export enum CardTypes {
  Tactic,
  Item,
  Monster,
  Character,
}

export enum CardClasses {
  Bowman,
  Magician,
  Thief,
  Warrior,
}

export interface Card {
  name: string;
  type: CardTypes;
  class: CardClasses;
  image: string;
  selected: boolean;
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
  class?: Record<CardClasses, number>;
}

export interface Skill {
  requirements: SkillRequirements;
  action: Action;
  activated: boolean;
  opts?: ActionOpts;
  targets?: ActionTargets;
}

export interface Ability {}
