import { Character, CardSubTypes, CardTypes, CardClasses } from '../../../card';
import { skillRef } from '../../../skill';
import { Location } from '../../../target';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Character,
};

export const nova: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'nova',
  name: 'Nova',
  image: 'Nova',
  health: 200,
  skills: [
    skillRef('l10quest'),
    [
      {
        requirements: { level: 20, class: { [CardClasses.Thief]: 2 } },
        action: 'play',
        activated: false,
        targets: {
          xor: [
            {
              level: 'CurrentLevel',
              location: Location.Hand,
              type: CardTypes.Item,
              subtype: [CardSubTypes.weapon],
              quantity: 1,
            },
            {
              level: 'CurrentLevel',
              location: Location.Hand,
              type: CardTypes.Tactic,
              subtype: [CardSubTypes.strategy],
              quantity: 1,
            },
            {
              level: 'CurrentLevel',
              location: Location.Hand,
              type: CardTypes.Monster,
              subtype: [CardSubTypes.undead],
              quantity: 1,
            },
          ],
        },
      },
    ],
    [
      {
        requirements: { level: 40, class: { [CardClasses.Thief]: 1 } },
        action: 'damage',
        opts: { damage: 20 },
        activated: false,
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
  ],
  ...defaultTypes,
};
