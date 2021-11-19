import { Item, CardTypes, CardSubTypes, CardClasses } from '../../card';
import { Location } from '../../target';

const defaultTypes = {
  type: CardTypes.Item,
  class: CardClasses.Warrior,
  selected: false,
};

export const battleshield: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'battleshield',
  name: 'Battle Shield',
  image: 'BattleShield',
  level: 35,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 50,
        class: {
          [CardClasses.Warrior]: 2,
        },
      },
      targets: {
        xor: [
          {
            level: 40,
            type: CardTypes.Item,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 40,
            type: CardTypes.Tactic,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    state: {
      targets: {
        xor: [
          {
            location: Location.OppField,
            quantity: 1,
            type: CardTypes.Monster,
          },
          {
            location: Location.Field,
            quantity: 1,
            type: CardTypes.Monster,
          },
        ],
      },
      modifier: { monster: { health: 20 } },
    },
  },
  subtypes: [CardSubTypes.shield],
  ...defaultTypes,
};

export const doombringer: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'doombringer',
  name: 'Doombringer',
  image: 'Doombringer',
  level: 70,
  skill: [
    {
      action: 'roar',
      activated: false,
      requirements: {
        level: 60,
        class: {
          [CardClasses.Warrior]: 3,
        },
      },
      opts: {
        damage: 20,
      },
      targets: {
        xor: [
          {
            type: CardTypes.Character,
            location: Location.Character,
            quantity: 1,
          },
          {
            type: CardTypes.Character,
            location: Location.OppCharacter,
            quantity: 1,
          },
          {
            type: CardTypes.Monster,
            location: Location.Field,
            quantity: 1,
          },
          {
            type: CardTypes.Monster,
            location: Location.OppField,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    triggers: [{ name: 'DoombringerTrigger', opts: { damage: 30 } }],
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const serpentstongue: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'serpentstongue',
  name: "Serpent's Tongue",
  image: 'SerpentsTongue',
  level: 50,
  skill: [
    {
      action: 'damage',
      activated: false,
      requirements: {
        level: 50,
        class: {
          [CardClasses.Warrior]: 2,
        },
      },
      opts: {
        damage: 20,
      },
      targets: {
        xor: [
          {
            type: CardTypes.Monster,
            location: Location.Field,
            quantity: 1,
          },
          {
            type: CardTypes.Monster,
            location: Location.OppField,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    triggers: [{ name: 'SerpentsTrigger', opts: { lifegain: 30 } }],
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const theninedragons: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'theninedragons',
  name: 'The Nine Dragons',
  image: 'TheNineDragons',
  level: 50,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 30,
        class: {
          [CardClasses.Warrior]: 1,
        },
      },
      targets: {
        level: 30,
        type: CardTypes.Item,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {
    state: {
      targets: {
        xor: [
          {
            location: Location.OppField,
            quantity: 1,
            type: CardTypes.Monster,
          },
          {
            location: Location.Field,
            quantity: 1,
            type: CardTypes.Monster,
          },
        ],
      },
      modifier: { monster: { attack: 20 } },
    },
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};
