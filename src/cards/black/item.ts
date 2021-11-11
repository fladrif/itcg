import { Item, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Item,
  class: CardClasses.Thief,
  selected: false,
};

export const coconutknife: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'coconutknife',
  name: 'Coconut Knife',
  image: 'CoconutKnife',
  level: 20,
  skill: [
    {
      action: 'quest',
      activated: false,
      requirements: {
        level: 0,
        oneshot: true,
      },
    },
    {
      action: 'discard',
      activated: false,
      requirements: {
        level: 0,
        oneshot: true,
      },
      targets: {
        location: Location.Hand,
        quantity: 1,
      },
      noReset: true,
    },
  ],
  ability: {
    triggers: [{ name: 'BattleBowTrigger', lifetime: { turn: 0 }, opts: { damage: 10 } }],
  },
  ...defaultTypes,
};

export const emeraldearrings: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'emeraldearrings',
  name: 'Emerald Earrings',
  image: 'EmeraldEarrings',
  level: 30,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 70,
        class: {
          [CardClasses.Thief]: 2,
        },
      },
      targets: {
        level: 70,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: { triggers: [{ name: 'EmeraldEarringsTrigger' }] },
  ...defaultTypes,
};

export const rednight: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'rednight',
  name: 'Red Night',
  image: 'RedNight',
  level: 10,
  skill: [
    {
      action: 'quest',
      activated: false,
      requirements: {
        level: 0,
        oneshot: true,
      },
    },
    {
      action: 'discard',
      activated: false,
      requirements: {
        level: 0,
        oneshot: true,
      },
      targets: {
        location: Location.Hand,
        quantity: 1,
      },
      noReset: true,
    },
  ],
  ability: {
    triggers: [{ name: 'RedNightTrigger' }],
  },
  ...defaultTypes,
};
