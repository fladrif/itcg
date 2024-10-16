import { Character, CardTypes, CardClasses } from '../../../card';
import { Location } from '../../../target';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Character,
};

export const bruno: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'bruno',
  name: 'Bruno',
  image: 'Bruno',
  health: 220,
  skills: [
    [
      {
        requirements: { level: 10, class: { [CardClasses.Warrior]: 1 } },
        action: 'damage',
        opts: { damage: 10 },
        activated: false,
        targets: {
          xor: [
            {
              type: CardTypes.Monster,
              location: Location.OppField,
              quantity: 1,
            },
            {
              location: Location.Character,
              quantity: 1,
            },
            {
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
        requirements: { level: 50, class: { [CardClasses.Warrior]: 3 } },
        action: 'bloodthirsty',
        activated: false,
        targets: {
          location: Location.CharAction,
          quantity: 1,
        },
      },
    ],
  ],
  ...defaultTypes,
};
