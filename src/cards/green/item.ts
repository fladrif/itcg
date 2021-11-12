import { Item, CardTypes, CardClasses } from '../../card';
import { Location } from '../../target';
import { Choice } from '../../stack';

const defaultTypes = {
  type: CardTypes.Item,
  class: CardClasses.Bowman,
  selected: false,
};

export const battlebow: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'battlebow',
  name: 'Battle Bow',
  image: 'BattleBow',
  level: 25,
  skill: [
    {
      action: 'criticalshot',
      activated: false,
      requirements: {
        level: 0,
        oneshot: true,
      },
      noReset: true,
      dialogPrompt: 'Choose heads or tails',
      choice: [Choice.Heads, Choice.Tails],
    },
  ],
  ability: {
    triggers: [{ name: 'BattleBowTrigger', lifetime: { turn: 0 }, opts: { damage: 20 } }],
  },
  ...defaultTypes,
};

export const goldencrow: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'goldencrow',
  name: 'Golden Crow',
  image: 'GoldenCrow',
  level: 60,
  skill: [
    {
      action: 'nomercy',
      activated: false,
      opts: { damage: 10 },
      requirements: {
        level: 50,
        class: {
          [CardClasses.Bowman]: 2,
        },
      },
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
  ability: { triggers: [{ name: 'GoldenCrowTrigger' }] },
  ...defaultTypes,
};
