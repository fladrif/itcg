import { Character, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Character,
  class: CardClasses.Bowman,
  selected: false,
};

export const nixie: Character = {
  name: 'Nixie',
  image: 'Nixie',
  health: 200,
  skills: [
    {
      requirements: { level: 10 },
      action: 'damage',
      opts: { damage: 10 },
      targets: {
        xor: [
          {
            type: CardTypes.Monster,
            quantity: 1,
            location: Location.OppBoard,
          },
          {
            type: CardTypes.Character,
            quantity: 1,
            location: Location.OppCharacter,
          },
        ],
      },
    },
    {
      requirements: { level: 20 },
      action: 'quest',
    },
    {
      requirements: { level: 30 },
      action: 'quest',
    },
  ],
  ...defaultTypes,
};
