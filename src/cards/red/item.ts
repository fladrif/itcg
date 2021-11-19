import { CardTypes, CardSubTypes, CardClasses, Item } from '../../card';
import { Location } from '../../target';

const defaultTypes = {
  type: CardTypes.Item,
  class: CardClasses.Magician,
  selected: false,
};

export const eviltale: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'eviltale',
  name: 'Evil Tale',
  image: 'EvilTale',
  level: 58,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 60,
        class: {
          [CardClasses.Magician]: 2,
        },
      },
      targets: {
        xor: [
          {
            level: 70,
            type: CardTypes.Tactic,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 70,
            type: CardTypes.Item,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: { triggers: [{ name: 'EvilTaleTrigger', opts: { damage: 30 } }] },
  subtypes: [CardSubTypes.wand],
  ...defaultTypes,
};

export const maplestaff: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'maplestaff',
  name: 'Maple Staff',
  image: 'MapleStaff',
  level: 35,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 30,
        class: {
          [CardClasses.Magician]: 2,
        },
      },
      targets: {
        level: 40,
        type: CardTypes.Tactic,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: { triggers: [{ name: 'MapleStaffTrigger' }] },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const redapprenticehat: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'redapprenticehat',
  name: 'Red Apprentice Hat',
  image: 'RedApprenticeHat',
  level: 10,
  skill: [
    {
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
        type: CardTypes.Item,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {
    skills: [
      {
        action: 'quest',
        requirements: { level: 0 },
        activated: false,
      },
    ],
    triggers: [{ name: 'RedApprenticeHatTrigger' }],
  },
  subtypes: [CardSubTypes.armor],
  ...defaultTypes,
};
