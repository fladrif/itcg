import { Monster, CardTypes, CardSubTypes } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Monster,
  attacks: 1,
  damageTaken: 0,
};

export const cerebes: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'cerebes',
  name: 'Cerebes',
  image: 'Cerebes',
  level: 72,
  attack: 70,
  health: 70,
  skill: skillRef('l80bbspawnequip120'),
  ability: { triggers: [{ name: 'EarthquakeTrigger', opts: { damage: 40 } }] },
  subtypes: [CardSubTypes.dog],
  ...defaultTypes,
};

export const curseeye: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'curseeye',
  name: 'Curse Eye',
  image: 'CurseEye',
  level: 35,
  attack: 30,
  health: 40,
  skill: skillRef('l50bbspawnthink40'),
  ability: {},
  subtypes: [CardSubTypes.worm],
  ...defaultTypes,
};

export const drake: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'drake',
  name: 'Drake',
  image: 'Drake',
  level: 50,
  attack: 30,
  health: 40,
  skill: skillRef('l80bbbdeadly'),
  ability: {
    skills: skillRef('dmg30'),
  },
  subtypes: [CardSubTypes.worm, CardSubTypes.dragon],
  ...defaultTypes,
};

export const fairy: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'fairy',
  name: 'Fairy',
  image: 'Fairy',
  level: 30,
  attack: 30,
  health: 20,
  skill: skillRef('l30bbspawn30'),
  ability: {
    triggers: [{ name: 'FairyTrigger' }],
  },
  subtypes: [CardSubTypes.flying, CardSubTypes.fairy],
  ...defaultTypes,
};

export const greentrixter: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'greentrixter',
  name: 'Green Trixter',
  image: 'GreenTrixter',
  level: 28,
  attack: 20,
  health: 20,
  skill: skillRef('l20beasy'),
  ability: {
    skills: skillRef('dmg10'),
  },
  subtypes: [CardSubTypes.pest],
  ...defaultTypes,
};

export const hector: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'hector',
  name: 'Hector',
  image: 'Hector',
  level: 50,
  attack: 50,
  health: 50,
  skill: skillRef('l60bbspawn70'),
  ability: {
    triggers: [
      {
        name: 'BuffAllTrigger',
        opts: { damage: 10 },
        lifetime: { usableTurnTemplate: 'ETBTurn' },
      },
    ],
  },
  subtypes: [CardSubTypes.wolf],
  ...defaultTypes,
};

export const hornedmushroom: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'hornedmushroom',
  name: 'Horned Mushroom',
  image: 'HornedMushroom',
  level: 22,
  attack: 20,
  health: 40,
  skill: skillRef('l40bbspawnequip30'),
  ability: {},
  subtypes: [CardSubTypes.mushroom],
  ...defaultTypes,
};

export const jrboogie: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'jrboogie',
  name: 'Jr. Boogie',
  image: 'JrBoogie',
  level: 35,
  attack: 30,
  health: 30,
  skill: skillRef('revive30'),
  ability: { keywords: ['stealthy'] },
  subtypes: [CardSubTypes.flying, CardSubTypes.spook],
  ...defaultTypes,
};

export const lunarpixie: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'lunarpixie',
  name: 'Lunar Pixie',
  image: 'LunarPixie',
  level: 45,
  attack: 40,
  health: 20,
  skill: skillRef('revive30'),
  ability: {
    keywords: ['stealthy'],
    skills: skillRef('dmg20'),
  },
  subtypes: [CardSubTypes.flying, CardSubTypes.spook],
  ...defaultTypes,
};

export const platoonchronos: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'platoonchronos',
  name: 'Platoon Chronos',
  image: 'PlatoonChronos',
  level: 41,
  attack: 30,
  health: 40,
  skill: skillRef('revive30'),
  ability: { keywords: ['stealthy'] },
  subtypes: [CardSubTypes.undead, CardSubTypes.spook],
  ...defaultTypes,
};

export const stirge: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'stirge',
  name: 'Stirge',
  image: 'Stirge',
  level: 20,
  attack: 30,
  health: 20,
  skill: skillRef('l60bspawnequip50'),
  ability: {},
  subtypes: [CardSubTypes.flying, CardSubTypes.bat],
  ...defaultTypes,
};

export const tweeter: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'tweeter',
  name: 'Tweeter',
  image: 'Tweeter',
  level: 39,
  attack: 20,
  health: 40,
  skill: skillRef('l60bbtricky'),
  ability: {
    triggers: [{ name: 'RevengeTrigger', opts: { damage: 20 } }],
  },
  subtypes: [CardSubTypes.flying, CardSubTypes.bird],
  ...defaultTypes,
};
