import { Character, CardTypes, CardClasses } from '../../card';

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
      action: 'quest',
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
