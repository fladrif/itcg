import { CardTypes, CardSubTypes, CardClasses, Tactic } from '../../card';
import { Location } from '../../target';

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
        noReset: true,
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
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};

export const pull: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'pull',
  name: 'Pull',
  image: 'Pull',
  level: 40,
  skill: [
    {
      action: 'scout',
      activated: false,
      requirements: { level: 0, oneshot: true },
    },
  ],
  ability: {
    skills: [
      {
        action: 'revealDeck',
        activated: false,
        requirements: { level: 0 },
      },
      {
        action: 'bounce',
        activated: false,
        requirements: { level: 0 },
        noReset: true,
        targets: {
          type: CardTypes.Monster,
          location: Location.Deck,
          quantity: 1,
          quantityUpTo: true,
        },
      },
      {
        action: 'shuffle',
        activated: false,
        requirements: { level: 0 },
      },
    ],
  },
  subtypes: [CardSubTypes.strategy],
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
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};
