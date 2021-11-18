import { CardTypes, CardClasses, Skill, Tactic } from '../../card';
import { Location } from '../../target';

const defaultTypes = {
  type: CardTypes.Tactic,
  class: CardClasses.Thief,
  selected: false,
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
  ...defaultTypes,
};
