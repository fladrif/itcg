import { ActionTargets, Location } from './actions';

export const complexFilterFinished: ActionTargets = {
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
          location: Location.Board,
        },
      ],
    },
  ],
};

export const complexFilterNotFinished: ActionTargets = {
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
          location: Location.Board,
        },
      ],
    },
  ],
};

export const complexFilterRecent: ActionTargets = {
  xor: [
    {
      level: 10,
      quantity: 1,
      location: Location.Hand,
    },
    {
      level: 10,
      quantity: 2,
      location: Location.Board,
    },
  ],
};
