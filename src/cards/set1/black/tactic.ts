import { CardTypes, CardSubTypes, CardClasses, Skill, Tactic } from '../../../card';
import { Location } from '../../../target';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Tactic,
};

const avengerDestroyAbility: Skill = {
  requirements: { level: 0 },
  action: 'destroy',
  activated: false,
  noReset: true,
  targets: {
    xor: [
      {
        quantity: 3,
        quantityUpTo: true,
        type: CardTypes.Monster,
        location: Location.OppField,
      },
    ],
  },
};

const avengerDrawAbility: Skill = {
  requirements: { level: 0 },
  action: 'quest',
  activated: false,
};

export const avenger: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'avenger',
  name: 'Avenger',
  image: 'Avenger',
  level: 70,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 70,
        class: {
          [CardClasses.Thief]: 1,
        },
      },
      targets: {
        level: 90,
        type: CardTypes.Tactic,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {
    skills: [avengerDestroyAbility, avengerDrawAbility],
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const doublestrike: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'doublestrike',
  name: 'Double Strike',
  image: 'DoubleStrike',
  level: 20,
  skill: [
    {
      action: 'damage',
      activated: false,
      opts: { damage: 20 },
      requirements: {
        level: 70,
        class: {
          [CardClasses.Thief]: 2,
        },
      },
      targets: {
        xor: [
          {
            location: Location.OppCharacter,
            quantity: 1,
          },
          {
            type: CardTypes.Monster,
            location: Location.OppField,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    skills: [
      {
        action: 'destroy',
        activated: false,
        requirements: { level: 0 },
        noReset: true,
        targets: {
          xor: [
            {
              type: CardTypes.Monster,
              location: Location.Field,
              quantity: 1,
            },
            {
              type: CardTypes.Monster,
              location: Location.OppField,
              quantity: 1,
            },
          ],
        },
      },
    ],
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const swipe: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'swipe',
  name: 'Swipe',
  image: 'Swipe',
  level: 30,
  skill: [
    {
      action: 'quest',
      activated: false,
      requirements: { level: 0, oneshot: true },
    },
    {
      action: 'discard',
      dialogPrompt: 'Discard a card',
      activated: false,
      requirements: { level: 0, oneshot: true },
      noReset: true,
      targets: {
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {
    skills: [
      {
        action: 'discard',
        dialogPrompt: 'Discard a card',
        activated: false,
        requirements: { level: 0 },
        noReset: true,
        opts: { randomDiscard: true },
      },
    ],
  },
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};
