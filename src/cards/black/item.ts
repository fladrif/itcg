import { Item, CardTypes, CardClasses } from '../../card';
import { Location } from '../../target';

const defaultTypes = {
  type: CardTypes.Item,
  class: CardClasses.Thief,
  selected: false,
};

export const bloodslain: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'bloodslain',
  name: 'Blood Slain',
  image: 'BloodSlain',
  level: 50,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 70,
        class: {
          [CardClasses.Thief]: 3,
        },
      },
      targets: {
        xor: [
          {
            level: 'CurrentLevel',
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    triggers: [{ name: 'BloodSlainTrigger', opts: { damage: 10 } }],
  },
  ...defaultTypes,
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

export const kumbithrowingstar: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'kumbithrowingstar',
  name: 'Kumbi Throwing-Star',
  image: 'KumbiThrowingStar',
  level: 30,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 10,
        class: {
          [CardClasses.Thief]: 1,
        },
      },
      targets: {
        xor: [
          {
            level: 20,
            type: CardTypes.Item,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    triggers: [{ name: 'KumbiTrigger', opts: { damage: 20 } }],
  },
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
