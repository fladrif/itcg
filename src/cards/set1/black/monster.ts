import { Monster, CardTypes, CardSubTypes } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Monster,
  attacks: 1,
  damageTaken: 0,
};

export const buffy: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'buffy',
  name: 'Buffy',
  image: 'Buffy',
  level: 61,
  attack: 40,
  health: 40,
  skill: skillRef('l20sneak20'),
  ability: {
    skills: skillRef('destroyskill'),
  },
  subtypes: [CardSubTypes.undead, CardSubTypes.clown],
  ...defaultTypes,
};

export const cico: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'cico',
  name: 'Cico',
  image: 'Cico',
  level: 25,
  attack: 30,
  health: 20,
  skill: skillRef('l40ttspawnequip30'),
  ability: {
    triggers: [{ name: 'LootTrigger' }],
  },
  subtypes: [CardSubTypes.water, CardSubTypes.beast],
  ...defaultTypes,
};

export const croco: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'croco',
  name: 'Croco',
  image: 'Croco',
  level: 52,
  attack: 70,
  health: 40,
  skill: skillRef('l30tttequipx'),
  ability: {},
  subtypes: [CardSubTypes.reptile],
  ...defaultTypes,
};

export const krappy: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'krappy',
  name: 'Krappy',
  image: 'Krappy',
  level: 24,
  attack: 60,
  health: 30,
  skill: skillRef('l30tstab'),
  ability: { keywords: ['confused'] },
  subtypes: [CardSubTypes.water, CardSubTypes.fish],
  ...defaultTypes,
};

export const krip: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'krip',
  name: 'Krip',
  image: 'Krip',
  level: 30,
  attack: 30,
  health: 20,
  skill: skillRef('l70ttslash'),
  ability: {},
  subtypes: [CardSubTypes.water, CardSubTypes.shrimp],
  ...defaultTypes,
};

export const lorang: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'lorang',
  name: 'Lorang',
  image: 'Lorang',
  level: 37,
  attack: 40,
  health: 10,
  skill: skillRef('l50tspawn50'),
  ability: { keywords: ['tough'] },
  subtypes: [CardSubTypes.water, CardSubTypes.crab],
  ...defaultTypes,
};

export const orangemushroom: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'orangemushroom',
  name: 'Orange Mushroom',
  image: 'OrangeMushroom',
  level: 8,
  attack: 30,
  health: 10,
  skill: skillRef('l30tequip40'),
  ability: {
    triggers: [{ name: 'LootTrigger' }],
  },
  subtypes: [CardSubTypes.mushroom],
  ...defaultTypes,
};

export const pinkteddy: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'pinkteddy',
  name: 'Pink Teddy',
  image: 'PinkTeddy',
  level: 32,
  attack: 30,
  health: 30,
  skill: skillRef('loot'),
  ability: {},
  subtypes: [CardSubTypes.toy, CardSubTypes.bear],
  ...defaultTypes,
};

export const propelly: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'propelly',
  name: 'Propelly',
  image: 'Propelly',
  level: 37,
  attack: 50,
  health: 20,
  skill: skillRef('loot'),
  ability: {},
  subtypes: [CardSubTypes.flying, CardSubTypes.toy],
  ...defaultTypes,
};

export const redsnail: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'redsnail',
  name: 'Red Snail',
  image: 'RedSnail',
  level: 4,
  attack: 10,
  health: 20,
  skill: skillRef('l70ttspawn90'),
  ability: { keywords: ['tough'] },
  subtypes: [CardSubTypes.pest],
  ...defaultTypes,
};

export const seacle: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'seacle',
  name: 'Seacle',
  image: 'Seacle',
  level: 23,
  attack: 20,
  health: 20,
  skill: skillRef('l30tspawnthink30'),
  ability: { triggers: [{ name: 'SlipperyTrigger' }] },
  subtypes: [CardSubTypes.water, CardSubTypes.beast],
  ...defaultTypes,
};

export const soulteddy: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'soulteddy',
  name: 'Soul Teddy',
  image: 'SoulTeddy',
  level: 63,
  attack: 50,
  health: 40,
  skill: skillRef('loot'),
  ability: {
    keywords: ['tough'],
    triggers: [{ name: 'StartleTrigger' }],
  },
  subtypes: [CardSubTypes.undead, CardSubTypes.toy, CardSubTypes.bear],
  ...defaultTypes,
};
