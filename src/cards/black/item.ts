import { Item, CardTypes, CardClasses } from '../../card';
import { SAMPLE_SKILL } from '../../card';

const defaultTypes = {
  type: CardTypes.Item,
  class: CardClasses.Thief,
  selected: false,
};

export const emeraldearrings: Omit<Item, 'key'> = {
  name: 'Emerald Earrings',
  image: 'EmeraldEarrings',
  level: 30,
  skill: SAMPLE_SKILL,
  ability: {},
  ...defaultTypes,
};
