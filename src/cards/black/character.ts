import { Character, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Character,
  class: CardClasses.Thief,
  selected: false,
};

export const ivan: Omit<Character, 'key' | 'owner'> = {
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
