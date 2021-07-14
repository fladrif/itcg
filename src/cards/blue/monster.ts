import { Monster, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Warrior,
  selected: false,
  attacks: 1,
  damageTaken: 0,
};

export const wildboar: Omit<Monster, 'key' | 'owner'> = {
  name: 'Wild Boar',
  image: 'WildBoar',
  level: 25,
  attack: 30,
  health: 30,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 40,
      class: {
        [CardClasses.Warrior]: 2,
      },
    },
    targets: {
      xor: [
        {
          level: 30,
          type: CardTypes.Tactic,
          location: Location.Hand,
          quantity: 1,
        },
        {
          level: 30,
          type: CardTypes.Item,
          location: Location.Hand,
          quantity: 1,
        },
      ],
    },
  },
  ability: {},
  ...defaultTypes,
};

export const slime: Omit<Monster, 'key' | 'owner'> = {
  name: 'Slime',
  image: 'Slime',
  level: 6,
  attack: 10,
  health: 10,
  skill: {
    action: 'refresh',
    activated: false,
    requirements: {
      level: 40,
      class: {
        [CardClasses.Warrior]: 2,
      },
    },
    opts: {
      lifegain: 10,
    },
  },
  ability: {},
  ...defaultTypes,
};

export const greenmushroom: Omit<Monster, 'key' | 'owner'> = {
  name: 'Green Mushroom',
  image: 'GreenMushroom',
  level: 15,
  attack: 10,
  health: 40,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 70,
      class: {
        [CardClasses.Warrior]: 2,
      },
    },
    targets: {
      xor: [
        {
          level: 90,
          type: CardTypes.Monster,
          location: Location.Hand,
          quantity: 1,
        },
        {
          level: 90,
          type: CardTypes.Item,
          location: Location.Hand,
          quantity: 1,
        },
      ],
    },
  },
  ability: {},
  ...defaultTypes,
};

export const ribbonpig: Omit<Monster, 'key' | 'owner'> = {
  name: 'Ribbon Pig',
  image: 'RibbonPig',
  level: 10,
  attack: 20,
  health: 20,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 10,
      class: {
        [CardClasses.Warrior]: 1,
      },
    },
    targets: {
      level: 20,
      type: CardTypes.Monster,
      location: Location.Hand,
      quantity: 1,
    },
  },
  ability: {},
  ...defaultTypes,
};
