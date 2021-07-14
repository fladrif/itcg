import { CardTypes, CardClasses, Skill, Tactic } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Tactic,
  class: CardClasses.Magician,
  selected: false,
};

const magicclawAbility: Skill = {
  requirements: { level: 0 },
  action: 'damage',
  activated: false,
  opts: {
    damage: 20,
  },
  targets: {
    xor: [
      {
        quantity: 1,
        type: CardTypes.Monster,
        location: Location.OppField,
      },
      {
        quantity: 1,
        location: Location.OppCharacter,
      },
    ],
  },
};

export const magicclaw: Omit<Tactic, 'key' | 'owner'> = {
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
  ability: {
    skills: [magicclawAbility, magicclawAbility],
  },
  ...defaultTypes,
};
