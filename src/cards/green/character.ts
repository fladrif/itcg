import { Character, CardTypes, CardClasses } from '../../card';
import { Location } from '../../target';

const defaultTypes = {
  type: CardTypes.Character,
  class: CardClasses.Bowman,
  selected: false,
};

export const nixie: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'nixie',
  name: 'Nixie',
  image: 'Nixie',
  health: 200,
  skills: [
    [
      {
        requirements: { level: 10, class: { [CardClasses.Bowman]: 1 } },
        action: 'damage',
        activated: false,
        opts: { damage: 10 },
        targets: {
          xor: [
            {
              type: CardTypes.Monster,
              quantity: 1,
              location: Location.OppField,
            },
            {
              type: CardTypes.Character,
              quantity: 1,
              location: Location.OppCharacter,
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
        requirements: { level: 50, class: { [CardClasses.Bowman]: 2 } },
        action: 'damage',
        activated: false,
        opts: { damage: 20 },
        targets: {
          xor: [
            {
              type: CardTypes.Monster,
              quantity: 1,
              location: Location.OppField,
            },
            {
              type: CardTypes.Character,
              quantity: 1,
              location: Location.OppCharacter,
            },
          ],
        },
      },
    ],
  ],
  ...defaultTypes,
};

export const skyhawk: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'skyhawk',
  name: 'Skyhawk',
  image: 'Skyhawk',
  health: 210,
  skills: [
    [
      {
        requirements: { level: 10, class: { [CardClasses.Bowman]: 1 } },
        action: 'damage',
        activated: false,
        opts: { damage: 10 },
        targets: {
          xor: [
            {
              type: CardTypes.Monster,
              quantity: 1,
              location: Location.OppField,
            },
            {
              type: CardTypes.Character,
              quantity: 1,
              location: Location.OppCharacter,
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
        requirements: { level: 60, class: { [CardClasses.Bowman]: 2 } },
        action: 'damage',
        activated: false,
        opts: { damage: 20 },
        dialogPrompt: 'Select a monster',
        targets: {
          xor: [
            {
              type: CardTypes.Monster,
              location: Location.OppField,
              quantity: 1,
              quantityUpTo: true,
            },
          ],
        },
      },
      {
        requirements: { level: 60, class: { [CardClasses.Bowman]: 2 } },
        action: 'damage',
        activated: false,
        opts: { damage: 20 },
        dialogPrompt: 'Select a character',
        noReset: true,
        targets: {
          xor: [
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
