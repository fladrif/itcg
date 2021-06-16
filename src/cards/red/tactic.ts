import { Tactic, CardTypes, CardClasses } from '../../card';
import { SAMPLE_SKILL } from '../../card';

const defaultTypes = {
  type: CardTypes.Tactic,
  class: CardClasses.Magician,
  selected: false,
};

export const magicclaw: Tactic = {
  name: 'Magic Claw',
  image: 'MagicClaw',
  level: 20,
  skill: SAMPLE_SKILL,
  ability: {},
  ...defaultTypes,
};
