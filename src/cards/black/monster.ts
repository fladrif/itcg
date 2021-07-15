import { Monster, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Thief,
  selected: false,
  attacks: 1,
  damageTaken: 0,
};

export const redsnail: Omit<Monster, 'key' | 'owner'> = {
  name: 'Red Snail',
  image: 'RedSnail',
  level: 4,
  attack: 10,
  health: 20,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 70,
      class: {
        [CardClasses.Thief]: 2,
      },
    },
    targets: {
      level: 90,
      type: CardTypes.Monster,
      location: Location.Hand,
      quantity: 1,
    },
  },
  ability: {},
  ...defaultTypes,
};

export const orangemushroom: Omit<Monster, 'key' | 'owner'> = {
  name: 'Orange Mushroom',
  image: 'OrangeMushroom',
  level: 8,
  attack: 30,
  health: 10,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 30,
      class: {
        [CardClasses.Thief]: 1,
      },
    },
    targets: {
      level: 40,
      type: CardTypes.Item,
      location: Location.Hand,
      quantity: 1,
    },
  },
  ability: {
    triggers: ['LootTrigger'],
  },
  ...defaultTypes,
};
