import { Monster, CardTypes, CardClasses } from '../../card';
import { SAMPLE_SKILL } from '../../card';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Bowman,
  selected: false,
  attacks: 1,
  damage: 0,
};

export const fairy: Omit<Monster, 'key'> = {
  name: 'Fairy',
  image: 'Fairy',
  level: 30,
  attack: 30,
  health: 20,
  skill: SAMPLE_SKILL,
  ability: {},
  ...defaultTypes,
};
