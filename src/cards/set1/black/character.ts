import { Character, CardTypes, CardClasses } from '../../../card';
import { Location } from '../../../target';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Character,
};

export const ivan: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'ivan',
  name: 'Ivan',
  image: 'Ivan',
  health: 220,
  skills: [
    [
      {
        requirements: { level: 10, class: { [CardClasses.Thief]: 1 } },
        action: 'damage',
        activated: false,
        opts: { damage: 10 },
        targets: {
          xor: [
            {
              type: CardTypes.Monster,
              location: Location.OppField,
              quantity: 1,
            },
            {
              type: CardTypes.Character,
              location: Location.OppCharacter,
              quantity: 1,
            },
          ],
        },
      },
    ],
    [
      {
        requirements: { level: 10 },
        action: 'quest',
        activated: false,
      },
    ],
    [
      {
        requirements: { level: 20, class: { [CardClasses.Thief]: 1 } },
        action: 'play',
        activated: false,
        targets: {
          level: 'CurrentLevel',
          type: CardTypes.Item,
          location: Location.Hand,
          quantity: 1,
        },
      },
    ],
  ],
  ...defaultTypes,
};

export const mistmoon: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'mistmoon',
  name: 'Mistmoon',
  image: 'Mistmoon',
  health: 200,
  skills: [
    [
      {
        requirements: { level: 10, class: { [CardClasses.Thief]: 1 } },
        action: 'damage',
        activated: false,
        opts: { damage: 10 },
        targets: {
          xor: [
            {
              type: CardTypes.Monster,
              location: Location.OppField,
              quantity: 1,
            },
            {
              type: CardTypes.Character,
              location: Location.OppCharacter,
              quantity: 1,
            },
          ],
        },
      },
    ],
    [
      {
        requirements: { level: 20 },
        action: 'quest',
        activated: false,
      },
    ],
    [
      {
        requirements: { level: 40, class: { [CardClasses.Thief]: 2 } },
        action: 'play',
        activated: false,
        targets: {
          level: 40,
          location: Location.Hand,
          quantity: 1,
        },
      },
    ],
  ],
  ...defaultTypes,
};
