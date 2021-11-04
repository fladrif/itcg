import { CardTypes, CardClasses, Tactic } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Tactic,
  class: CardClasses.Warrior,
  selected: false,
};

export const itemtrade: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'itemtrade',
  name: 'Item Trade',
  image: 'ItemTrade',
  level: 30,
  skill: [
    {
      action: 'drinkpotion',
      activated: false,
      requirements: { level: 0, oneshot: true },
    },
  ],
  ability: {
    skills: [
      {
        requirements: { level: 0 },
        action: 'destroy',
        activated: false,
        targets: {
          xor: [
            {
              type: CardTypes.Item,
              location: Location.Field,
              quantity: 1,
            },
            {
              type: CardTypes.Item,
              location: Location.OppField,
              quantity: 1,
            },
          ],
        },
      },
    ],
  },
  ...defaultTypes,
};
export const resting: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'resting',
  name: 'Resting',
  image: 'Resting',
  level: 10,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 70,
        class: {
          [CardClasses.Warrior]: 1,
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
            type: CardTypes.Tactic,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    skills: [
      {
        requirements: { level: 0 },
        action: 'refresh',
        activated: false,
        opts: {
          lifegain: 20,
        },
      },
      {
        requirements: { level: 0 },
        action: 'quest',
        activated: false,
      },
    ],
  },
  ...defaultTypes,
};
