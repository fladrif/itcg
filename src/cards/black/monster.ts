import { Monster, CardTypes, CardClasses } from '../../card';
import { SAMPLE_SKILL } from '../../card';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Thief,
  selected: false,
  attacks: 1,
  damage: 0,
};

export const redsnail: Omit<Monster, 'key'> = {
  name: 'Red Snail',
  image: 'RedSnail',
  level: 4,
  attack: 10,
  health: 20,
  skill: SAMPLE_SKILL,
  ability: {},
  ...defaultTypes,
};

export const orangemushroom: Omit<Monster, 'key'> = {
  name: 'Orange Mushroom',
  image: 'OrangeMushroom',
  level: 8,
  attack: 30,
  health: 10,
  skill: SAMPLE_SKILL,
  ability: {},
  ...defaultTypes,
};
