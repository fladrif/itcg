import { Monster, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Magician,
  selected: false,
  attacks: 1,
  damageTaken: 0,
};

export const darkaxestump: Omit<Monster, 'key' | 'owner'> = {
  name: 'Dark Axe Stump',
  image: 'DarkAxeStump',
  level: 22,
  attack: 10,
  health: 40,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 40,
      class: {
        [CardClasses.Magician]: 2,
      },
    },
    targets: {
      level: 40,
      type: CardTypes.Monster,
      location: Location.Hand,
      quantity: 1,
    },
  },
  ability: {},
  ...defaultTypes,
};

export const jrnecki: Omit<Monster, 'key' | 'owner'> = {
  name: 'Jr. Necki',
  image: 'JrNecki',
  level: 21,
  attack: 30,
  health: 30,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 30,
      class: {
        [CardClasses.Magician]: 1,
      },
    },
    targets: {
      level: 30,
      type: CardTypes.Monster,
      location: Location.Hand,
      quantity: 1,
    },
  },
  ability: {},
  ...defaultTypes,
};

export const octopus: Omit<Monster, 'key' | 'owner'> = {
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
  ability: {
    triggers: ['GeniusTrigger'],
  },
  ...defaultTypes,
};
