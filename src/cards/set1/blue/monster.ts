import { Monster, CardTypes, CardSubTypes } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Monster,
  attacks: 1,
  damageTaken: 0,
};

export const blockgolem: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'blockgolem',
  name: 'Block Golem',
  image: 'BlockGolem',
  level: 42,
  attack: 40,
  health: 40,
  skill: skillRef('scout'),
  ability: {},
  subtypes: [CardSubTypes.guardian],
  ...defaultTypes,
};

export const fireboar: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'fireboar',
  name: 'Fire Boar',
  image: 'FireBoar',
  level: 32,
  attack: 10,
  health: 50,
  skill: skillRef('l30wwspawn40'),
  ability: { keywords: ['fierce'] },
  subtypes: [CardSubTypes.fire, CardSubTypes.boar],
  ...defaultTypes,
};

export const greenmushroom: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'greenmushroom',
  name: 'Green Mushroom',
  image: 'GreenMushroom',
  level: 15,
  attack: 10,
  health: 40,
  skill: skillRef('l70wwspawnequip90'),
  ability: {},
  subtypes: [CardSubTypes.mushroom],
  ...defaultTypes,
};

export const grizzly: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'grizzly',
  name: 'Grizzly',
  image: 'Grizzly',
  level: 56,
  attack: 50,
  health: 60,
  skill: skillRef('l50wwwspawnx'),
  ability: {},
  subtypes: [CardSubTypes.bear],
  ...defaultTypes,
};

export const jryeti: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'jryeti',
  name: 'Jr. Yeti',
  image: 'JrYeti',
  level: 50,
  attack: 20,
  health: 50,
  skill: skillRef('l50wwcrush'),
  ability: { keywords: ['fierce'] },
  subtypes: [CardSubTypes.ice, CardSubTypes.beast],
  ...defaultTypes,
};

export const officerskeleton: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'officerskeleton',
  name: 'Officer Skeleton',
  image: 'OfficerSkeleton',
  level: 63,
  attack: 50,
  health: 60,
  skill: skillRef('l50wwbuff10'),
  ability: {
    triggers: [{ name: 'BoneRattleTrigger', opts: { damage: 20 } }],
  },
  subtypes: [CardSubTypes.undead, CardSubTypes.soldier],
  ...defaultTypes,
};

export const panda: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'panda',
  name: 'Panda',
  image: 'Panda',
  level: 60,
  attack: 40,
  health: 60,
  skill: skillRef('revive50'),
  ability: {
    triggers: [{ name: 'MysticPowerTrigger', opts: { lifegain: 40 } }],
  },
  subtypes: [CardSubTypes.bear],
  ...defaultTypes,
};

export const pepe: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'pepe',
  name: 'Pepe',
  image: 'Pepe',
  level: 60,
  attack: 40,
  health: 70,
  skill: skillRef('l60wspawnthink70'),
  ability: {
    triggers: [{ name: 'RelentlessTrigger', opts: { damage: 10 } }],
  },
  subtypes: [CardSubTypes.king, CardSubTypes.ice, CardSubTypes.bird],
  ...defaultTypes,
};

export const ribbonpig: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'ribbonpig',
  name: 'Ribbon Pig',
  image: 'RibbonPig',
  level: 10,
  attack: 20,
  health: 20,
  skill: skillRef('l10wspawn20'),
  ability: {},
  subtypes: [CardSubTypes.boar],
  ...defaultTypes,
};

export const sentinel: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'sentinel',
  name: 'Sentinel',
  image: 'Sentinel',
  level: 30,
  attack: 20,
  health: 30,
  skill: skillRef('scout'),
  ability: {},
  subtypes: [CardSubTypes.mechanical, CardSubTypes.guardian],
  ...defaultTypes,
};

export const slime: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'slime',
  name: 'Slime',
  image: 'Slime',
  level: 6,
  attack: 10,
  health: 10,
  skill: skillRef('l40wwrefresh'),
  ability: {
    skills: skillRef('destroyitem'),
  },
  subtypes: [CardSubTypes.goo],
  ...defaultTypes,
};

export const stonegolem: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'stonegolem',
  name: 'Stone Golem',
  image: 'StoneGolem',
  level: 55,
  attack: 40,
  health: 70,
  skill: skillRef('scout'),
  ability: { triggers: [{ name: 'RelentlessTrigger', opts: { damage: 40 } }] },
  subtypes: [CardSubTypes.goo],
  ...defaultTypes,
};

export const tauromacis: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'tauromacis',
  name: 'Tauromacis',
  image: 'Tauromacis',
  level: 70,
  attack: 50,
  health: 40,
  skill: skillRef('trainhard'),
  ability: {
    triggers: [{ name: 'PrevailTrigger' }],
  },
  subtypes: [CardSubTypes.bull, CardSubTypes.human],
  ...defaultTypes,
};

export const wildboar: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'wildboar',
  name: 'Wild Boar',
  image: 'WildBoar',
  level: 25,
  attack: 30,
  health: 30,
  skill: skillRef('l40wwthinkequip30'),
  ability: {},
  subtypes: [CardSubTypes.boar],
  ...defaultTypes,
};

export const yetipepe: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'yetipepe',
  name: 'Yeti & Pepe',
  image: 'YetiPepe',
  level: 78,
  attack: 50,
  health: 80,
  skill: skillRef('l70wwwspawnequip100'),
  ability: {
    keywords: ['fierce'],
    triggers: [{ name: 'RelentlessTrigger', opts: { damage: 20 } }],
  },
  subtypes: [CardSubTypes.ice, CardSubTypes.bird, CardSubTypes.beast],
  ...defaultTypes,
};
