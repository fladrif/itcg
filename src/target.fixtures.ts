import { ActionTargets, Location } from './actions';
import { PlayerState } from './game';
import { instantiateCard } from './card';
import { nixie } from './cards';

export const filterFinished: ActionTargets = {
  xor: [
    {
      level: 1,
      quantity: 1,
      location: Location.CharAction,
    },
    {
      and: [
        {
          level: 10,
          quantity: 1,
          location: Location.Hand,
        },
        {
          level: 10,
          quantity: 1,
          location: Location.Field,
        },
      ],
    },
  ],
};

export const filterNotFinished: ActionTargets = {
  xor: [
    {
      level: 1,
      quantity: 1,
      location: Location.CharAction,
    },
    {
      and: [
        {
          level: 10,
          quantity: 2,
          location: Location.Hand,
        },
        {
          level: 10,
          quantity: 1,
          location: Location.Field,
        },
      ],
    },
  ],
};

export const filterRecent: ActionTargets = {
  xor: [
    {
      level: 10,
      quantity: 1,
      location: Location.Hand,
    },
    {
      level: 10,
      quantity: 2,
      location: Location.Field,
    },
  ],
};

export const filterCurrentLevelBefore: ActionTargets = {
  xor: [
    {
      level: 10,
      quantity: 1,
      location: Location.CharAction,
    },
    {
      and: [
        {
          level: 'CurrentLevel',
          quantity: 1,
          location: Location.Hand,
        },
        {
          level: 'CurrentLevel',
          quantity: 1,
          location: Location.Field,
        },
      ],
    },
  ],
};

export const filterCurrentLevelAfter: ActionTargets = {
  xor: [
    {
      level: 10,
      quantity: 1,
      location: Location.CharAction,
    },
    {
      and: [
        {
          level: 40,
          quantity: 1,
          location: Location.Hand,
        },
        {
          level: 40,
          quantity: 1,
          location: Location.Field,
        },
      ],
    },
  ],
};

export const playerState: PlayerState = {
  deck: [],
  character: instantiateCard(nixie, '0')[0],
  hand: [],
  learnedSkills: [],
  field: [],
  discard: [],
  hp: 10,
  maxHP: 10,
  level: 40,
  activationPos: 0,
};
