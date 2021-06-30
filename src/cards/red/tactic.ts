import { Tactic, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Tactic,
  class: CardClasses.Magician,
  selected: false,
};

export const magicclaw: Omit<Tactic, 'key'> = {
  name: 'Magic Claw',
  image: 'MagicClaw',
  level: 20,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 20,
      class: {
        [CardClasses.Magician]: 1,
      },
    },
    targets: {
      level: 30,
      type: CardTypes.Tactic,
      location: Location.Hand,
      quantity: 1,
    },
  },
  ability: {},
  ...defaultTypes,
};
