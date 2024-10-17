import { CardTypes, CardSubTypes, Tactic } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Tactic,
};

export const arrowblow: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'arrowblow',
  name: 'Arrow Blow',
  image: 'ArrowBlow',
  level: 10,
  skill: skillRef('l50bspawnthink40'),
  ability: {
    skills: skillRef('dmg30'),
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const focus: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'focus',
  name: 'Focus',
  image: 'Focus',
  level: 20,
  skill: skillRef('l40bbthink40'),
  ability: {
    triggers: [
      {
        name: 'FocusTrigger',
        opts: {
          damage: 50,
        },
        lifetime: {
          usableTurnTemplate: 'ETBTurn',
          once: true,
        },
      },
    ],
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const powerknockback: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'powerknockback',
  name: 'Power Knock-Back',
  image: 'PowerKnockBack',
  level: 40,
  skill: skillRef('l60bbtricky'),
  ability: {
    skills: skillRef('powerkb'),
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const rainofarrows: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'rainofarrows',
  name: 'Rain Of Arrows',
  image: 'RainOfArrows',
  level: 40,
  skill: skillRef('steadyhand'),
  ability: {
    skills: skillRef('rainofarrows'),
  },
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};

export const riskyshot: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'riskyshot',
  name: 'Risky Shot',
  image: 'RiskyShot',
  level: 40,
  skill: skillRef('l60bbthinkequip50'),
  ability: {
    skills: skillRef('riskyshot'),
  },
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};

export const soularrow: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'soularrow',
  name: 'Soul Arrow',
  image: 'SoulArrow',
  level: 30,
  skill: skillRef('l20beasy'),
  ability: {
    skills: skillRef('soularrow'),
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};
