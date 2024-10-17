import { CardTypes, CardSubTypes, Item } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Item,
};

export const eviltale: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'eviltale',
  name: 'Evil Tale',
  image: 'EvilTale',
  level: 58,
  skill: skillRef('l60mmthinkequip70'),
  ability: { triggers: [{ name: 'EvilTaleTrigger', opts: { damage: 30 } }] },
  subtypes: [CardSubTypes.wand],
  ...defaultTypes,
};

export const maplestaff: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'maplestaff',
  name: 'Maple Staff',
  image: 'MapleStaff',
  level: 35,
  skill: skillRef('l30mmthink40'),
  ability: { triggers: [{ name: 'MapleStaffTrigger' }] },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const redapprenticehat: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'redapprenticehat',
  name: 'Red Apprentice Hat',
  image: 'RedApprenticeHat',
  level: 10,
  skill: skillRef('l40mmequip40'),
  ability: {
    skills: skillRef('quest'),
    triggers: [{ name: 'RedApprenticeHatTrigger' }],
  },
  subtypes: [CardSubTypes.armor],
  ...defaultTypes,
};
