import { Monster, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Thief,
  selected: false,
  attacks: 1,
  damageTaken: 0,
};

export const buffy: Omit<Monster, 'key' | 'owner'> = {
  name: 'Buffy',
  image: 'Buffy',
  level: 61,
  attack: 40,
  health: 40,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 20,
      class: {
        [CardClasses.Thief]: 1,
      },
    },
    targets: {
      level: 20,
      location: Location.Hand,
      quantity: 1,
    },
  },
  ability: {
    skills: [
      {
        action: 'destroy',
        activated: false,
        requirements: { level: 0 },
        targets: {
          xor: [
            {
              location: Location.OppCharAction,
              quantity: 1,
            },
            {
              location: Location.CharAction,
              quantity: 1,
            },
          ],
        },
      },
    ],
  },
  ...defaultTypes,
};

export const cico: Omit<Monster, 'key' | 'owner'> = {
  name: 'Cico',
  image: 'Cico',
  level: 25,
  attack: 30,
  health: 20,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 40,
      class: {
        [CardClasses.Thief]: 2,
      },
    },
    targets: {
      xor: [
        {
          level: 30,
          type: CardTypes.Item,
          location: Location.Hand,
          quantity: 1,
        },
        {
          level: 30,
          type: CardTypes.Monster,
          location: Location.Hand,
          quantity: 1,
        },
      ],
    },
  },
  ability: {
    triggers: [{ name: 'LootTrigger' }],
  },
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
    triggers: [{ name: 'LootTrigger' }],
  },
  ...defaultTypes,
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
  ability: { keywords: ['tough'] },
  ...defaultTypes,
};
