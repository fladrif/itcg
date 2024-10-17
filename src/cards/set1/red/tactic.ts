import { CardTypes, CardSubTypes, Tactic } from '../../../card';
import { skillRef } from '../../../skill';
import { Location } from '../../../target';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Tactic,
};

export const energybolt: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'energybolt',
  name: 'Energy Bolt',
  image: 'EnergyBolt',
  level: 40,
  skill: skillRef('l60mmspawnthink70'),
  ability: {
    skills: skillRef('dmg80'),
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const heal: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'heal',
  name: 'Heal',
  image: 'Heal',
  level: 40,
  skill: skillRef('l30mequip30'),
  ability: {
    skills: skillRef('heal'),
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const knowledgeispower: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'knowledgeispower',
  name: 'Knowledge Is Power',
  image: 'KnowledgeIsPower',
  level: 20,
  skill: skillRef('l40mmmthinkx'),
  ability: {
    skills: skillRef('knowledge'),
  },
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};

export const magicclaw: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'magicclaw',
  name: 'Magic Claw',
  image: 'MagicClaw',
  level: 20,
  skill: skillRef('l20mthink30'),
  ability: {
    skills: skillRef('magicclaw'),
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const meditation: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'meditation',
  name: 'Meditation',
  image: 'Meditation',
  level: 30,
  skill: skillRef('l10massist'),
  ability: {
    triggers: [
      {
        name: 'MeditationTrigger',
        opts: {
          damage: 40,
        },
        lifetime: {
          usableTurnTemplate: 'ETBTurn',
          once: true,
        },
      },
    ],
    skills: skillRef('quest'),
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const mpeater: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'mpeater',
  name: 'MP Eater',
  image: 'MPEater',
  level: 30,
  skill: skillRef('jumble'),
  ability: {
    triggers: [
      {
        name: 'MPEaterTrigger',
        lifetime: {
          usableTurnTemplate: 'YourNextTurn',
          once: true,
        },
      },
    ],
    // TODO: refactor to use target location instead of 'targetOpponent'
    state: {
      modifier: {
        target: {
          action: 'mpeater',
        },
      },
      targets: {
        type: CardTypes.Monster,
        location: Location.Field,
        quantity: 1,
      },
      targetOpponent: true,
      lifetime: { until: true, setTurn: 'NextTurn' },
    },
    skills: skillRef('mpeater'),
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const sidequest: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'sidequest',
  name: 'Side Quest',
  image: 'SideQuest',
  level: 40,
  skill: skillRef('l30mthink40'),
  ability: {
    skills: skillRef('sidequest'),
  },
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};

export const teleport: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'teleport',
  name: 'Teleport',
  image: 'Teleport',
  level: 50,
  skill: skillRef('jumpquest'),
  ability: {
    state: {
      targets: {
        xor: [
          {
            type: CardTypes.Character,
            location: Location.OppCharacter,
            quantity: 1,
          },
          {
            type: CardTypes.Character,
            location: Location.Character,
            quantity: 1,
          },
        ],
      },
      modifier: {
        target: {
          action: 'attack',
        },
      },
      lifetime: { setTurn: 'NextTurn' },
    },
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const thunderbolt: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'thunderbolt',
  name: 'Thunder Bolt',
  image: 'ThunderBolt',
  level: 60,
  skill: skillRef('l60mmmblast'),
  ability: {
    skills: skillRef('thunderbolt'),
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};
