import { CardTypes, CardClasses, Skill, Tactic } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Tactic,
  class: CardClasses.Thief,
  selected: false,
};

const avengerDestroyAbility: Skill = {
  requirements: { level: 0 },
  action: 'destroy',
  activated: false,
  targets: {
    xor: [
      {
        quantity: 3,
        quantityUpTo: true,
        type: CardTypes.Monster,
        location: Location.OppField,
      },
    ],
  },
};

const avengerDrawAbility: Skill = {
  requirements: { level: 0 },
  action: 'quest',
  activated: false,
};

export const avenger: Omit<Tactic, 'key' | 'owner'> = {
  name: 'Avenger',
  image: 'Avenger',
  level: 70,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 70,
      class: {
        [CardClasses.Thief]: 1,
      },
    },
    targets: {
      level: 90,
      type: CardTypes.Tactic,
      location: Location.Hand,
      quantity: 1,
    },
  },
  ability: {
    skills: [avengerDestroyAbility, avengerDrawAbility],
  },
  ...defaultTypes,
};
