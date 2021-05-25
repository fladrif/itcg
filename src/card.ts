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

export interface Skill {}
export interface Ability {}

export const cardback: Card = {
  name: "cardback",
  image: "Cardback",
  type: CardTypes.Character,
  class: CardClasses.Warrior,
};
