import { Character, CardTypes, CardClasses } from '../../card';
import { Location } from '../../target';

const defaultTypes = {
  type: CardTypes.Character,
  class: CardClasses.Magician,
  selected: false,
};

export const maya: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'maya',
  name: 'Maya',
  image: 'Maya',
  health: 190,
  skills: [
    [
      {
        requirements: { level: 10 },
        action: 'quest',
        activated: false,
      },
    ],
    [
      {
        requirements: { level: 20, class: { [CardClasses.Magician]: 1 } },
        action: 'damage',
        opts: { damage: 10 },
        activated: false,
        targets: {
          xor: [
            {
              location: Location.Character,
              quantity: 1,
            },
            {
              location: Location.OppCharacter,
              quantity: 1,
            },
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
    [
      {
        requirements: { level: 30, class: { [CardClasses.Magician]: 2 } },
        action: 'play',
        activated: false,
        targets: {
          level: 'CurrentLevel',
          type: CardTypes.Tactic,
          location: Location.Hand,
          quantity: 1,
        },
      },
    ],
  ],
  ...defaultTypes,
};

export const stormwind: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'stormwind',
  name: 'Stormwind',
  image: 'Stormwind',
  health: 180,
  skills: [
    [
      {
        requirements: { level: 10 },
        action: 'quest',
        activated: false,
      },
    ],
    [
      {
        requirements: { level: 30, class: { [CardClasses.Magician]: 2 } },
        action: 'play',
        activated: false,
        targets: {
          level: 'CurrentLevel',
          type: CardTypes.Tactic,
          location: Location.Hand,
          quantity: 1,
        },
      },
    ],
    [
      {
        requirements: { level: 70, class: { [CardClasses.Magician]: 3 } },
        action: 'damage',
        opts: { damage: 40 },
        activated: false,
        dialogPrompt: 'Select a character',
        targets: {
          xor: [
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
  ],
  ...defaultTypes,
};
