import { Monster, CardTypes, CardSubTypes } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Monster,
  attacks: 1,
  damageTaken: 0,
};

export const bellflowerroot: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'bellflowerroot',
  name: 'Bellflower Root',
  image: 'BellflowerRoot',
  level: 53,
  attack: 40,
  health: 60,
  skill: skillRef('l50mmthinkequip50'),
  ability: {},
  subtypes: [CardSubTypes.flora],
  ...defaultTypes,
};

export const chiefgray: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'chiefgray',
  name: 'Chief Gray',
  image: 'ChiefGray',
  level: 49,
  attack: 10,
  health: 30,
  skill: skillRef('quest'),
  ability: { triggers: [{ name: 'SuperGeniusTrigger' }] },
  subtypes: [CardSubTypes.alien],
  ...defaultTypes,
};

export const darkaxestump: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'darkaxestump',
  name: 'Dark Axe Stump',
  image: 'DarkAxeStump',
  level: 22,
  attack: 10,
  health: 40,
  skill: skillRef('l40mmspawn40'),
  ability: {},
  subtypes: [CardSubTypes.dark, CardSubTypes.flora],
  ...defaultTypes,
};

export const jrnecki: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'jrnecki',
  name: 'Jr. Necki',
  image: 'JrNecki',
  level: 21,
  attack: 30,
  health: 30,
  skill: skillRef('l30mspawn30'),
  ability: {},
  subtypes: [CardSubTypes.worm],
  ...defaultTypes,
};

export const lioner: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'lioner',
  name: 'Lioner',
  image: 'Lioner',
  level: 53,
  attack: 50,
  health: 50,
  skill: skillRef('l70mmspawnthink90'),
  ability: {},
  subtypes: [CardSubTypes.kitty],
  ...defaultTypes,
};

export const lucida: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'lucida',
  name: 'Lucida',
  image: 'Lucida',
  level: 73,
  attack: 60,
  health: 90,
  skill: skillRef('conjure'),
  ability: {
    triggers: [{ name: 'WickedTrigger' }],
  },
  subtypes: [CardSubTypes.dark, CardSubTypes.kitty],
  ...defaultTypes,
};

export const octopus: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'octopus',
  name: 'Octopus',
  image: 'Octopus',
  level: 12,
  attack: 10,
  health: 10,
  skill: skillRef('quest'),
  ability: {
    skills: skillRef('quest'),
  },
  subtypes: [CardSubTypes.alien],
  ...defaultTypes,
};

export const peachmonkey: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'peachmonkey',
  name: 'Peach Monkey',
  image: 'PeachMonkey',
  level: 62,
  attack: 60,
  health: 60,
  skill: skillRef('l80mmspawn120'),
  ability: {
    skills: skillRef('destroyitem'),
  },
  subtypes: [CardSubTypes.monkey],
  ...defaultTypes,
};

export const zetagray: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'zetagray',
  name: 'Zeta Gray',
  image: 'ZetaGray',
  level: 42,
  attack: 20,
  health: 20,
  skill: skillRef('quest'),
  ability: {
    skills: skillRef('quest'),
  },
  subtypes: [CardSubTypes.alien],
  ...defaultTypes,
};

export const zombielupin: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'zombielupin',
  name: 'Zombie Lupin',
  image: 'ZombieLupin',
  level: 40,
  attack: 20,
  health: 20,
  skill: skillRef('drinkpotion'),
  ability: {
    skills: skillRef('devious'),
  },
  subtypes: [CardSubTypes.undead, CardSubTypes.monkey],
  ...defaultTypes,
};
