import { Monster, CardTypes, CardClasses } from '../../card';
import { SAMPLE_SKILL } from '../../card';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Magician,
  selected: false,
  attacks: 1,
  damage: 0,
};

export const darkaxestump: Omit<Monster, 'key'> = {
  name: 'Dark Axe Stump',
  image: 'DarkAxeStump',
  level: 22,
  attack: 10,
  health: 40,
  skill: SAMPLE_SKILL,
  ability: {},
  ...defaultTypes,
};

export const jrnecki: Omit<Monster, 'key'> = {
  name: 'Jr. Necki',
  image: 'JrNecki',
  level: 21,
  attack: 30,
  health: 30,
  skill: SAMPLE_SKILL,
  ability: {},
  ...defaultTypes,
};

export const octopus: Omit<Monster, 'key'> = {
  name: 'Octopus',
  image: 'Octopus',
  level: 12,
  attack: 10,
  health: 10,
  skill: {
    action: 'quest',
    requirements: {
      level: 0,
      turn: -1,
    },
    activated: false,
  },
  ability: {},
  ...defaultTypes,
};
