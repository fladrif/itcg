import { Monster, CardTypes, CardSubTypes, CardClasses } from '../../../card';
import { Location } from '../../../target';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Monster,
  attacks: 1,
  damageTaken: 0,
};

export const manon: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'manon',
  name: 'Manon',
  image: 'Manon',
  level: 105,
  attack: 60,
  health: 160,
  skill: [],
  ability: {
    triggers: [{ name: 'MysticPowerTrigger', opts: { lifegain: 40 } }],
  },
  subtypes: [CardSubTypes.boss],
  ...defaultTypes,
};
