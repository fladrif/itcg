import { Ctx, PlayerID } from 'boardgame.io';
import lodash from 'lodash';

import * as cards from './cards';
import { instantiateCard, isMonster, Monster, Character, NonCharacter } from './card';
import {
  shuffleDeck,
  levelUp,
  noLevel,
  activateSkill,
  noActivate,
  selectTarget,
  confirmSkill,
  declineSkill,
  attack,
  noAttacks,
} from './moves';
import { Stack } from './stack';

const SAMPLE_DECK: NonCharacter[] = [
  ...instantiateCard(cards.slime),
  ...instantiateCard(cards.fairy, 4),
  ...instantiateCard(cards.jrnecki),
  ...instantiateCard(cards.octopus),
  ...instantiateCard(cards.redsnail),
  ...instantiateCard(cards.wildboar),
  ...instantiateCard(cards.magicclaw),
  ...instantiateCard(cards.ribbonpig),
  ...instantiateCard(cards.darkaxestump),
  ...instantiateCard(cards.greenmushroom),
  ...instantiateCard(cards.orangemushroom),
  ...instantiateCard(cards.emeraldearrings),
];

interface Deck {
  character: Character;
  deck: NonCharacter[];
}

export interface PlayerState {
  deck: NonCharacter[];
  character: Character;
  hand: NonCharacter[];
  learnedSkills: NonCharacter[];
  field: NonCharacter[];
  hp: number;
  maxHP: number;
  level: number;
  activationPos: number;
}

export interface SetupData {
  players: [{ id: PlayerID; deck: Deck }];
}

export interface GameState {
  player: Record<PlayerID, PlayerState>;
  stack?: Stack;
}

function preConfigSetup(): GameState {
  const state = { player: {} } as GameState;

  state.player['0'] = {
    deck: lodash(SAMPLE_DECK).shuffle().value(),
    character: instantiateCard(cards.sherman)[0],
    hand: [],
    learnedSkills: [],
    field: [],
    hp: cards.sherman.health,
    maxHP: cards.sherman.health,
    level: 0,
    activationPos: 0,
  };

  state.player['1'] = {
    deck: lodash(SAMPLE_DECK).shuffle().value(),
    character: instantiateCard(cards.nixie)[0],
    hand: [],
    learnedSkills: [],
    field: [],
    hp: cards.nixie.health,
    maxHP: cards.nixie.health,
    level: 0,
    activationPos: 0,
  };

  state.player['0'].hand.push(state.player['0'].deck.pop()!);
  state.player['0'].hand.push(state.player['0'].deck.pop()!);
  state.player['0'].hand.push(state.player['0'].deck.pop()!);
  state.player['0'].hand.push(state.player['0'].deck.pop()!);

  state.player['1'].hand.push(state.player['1'].deck.pop()!);
  state.player['1'].hand.push(state.player['1'].deck.pop()!);
  state.player['1'].hand.push(state.player['1'].deck.pop()!);
  state.player['1'].hand.push(state.player['1'].deck.pop()!);
  state.player['1'].hand.push(state.player['1'].deck.pop()!);

  return state;
}

export function setup(_ctx: Ctx, setupData: SetupData): GameState {
  const state: GameState = {
    player: {},
  };

  for (const player of setupData.players) {
    state.player[player.id] = {
      deck: player.deck.deck,
      character: instantiateCard(cards.sherman)[0],
      hand: [],
      learnedSkills: [],
      field: [],
      hp: cards.sherman.health,
      maxHP: cards.sherman.health,
      level: 0,
      activationPos: 0,
    };
  }
  return state;
}

export const ITCG = {
  name: 'ITCG',

  setup: preConfigSetup,

  moves: {
    shuffleDeck,
    levelUp,
    activateSkill,
  },

  turn: {
    onBegin: (G: GameState, ctx: Ctx) => {
      ctx.events!.setActivePlayers!({ currentPlayer: 'level' });
      // TODO: Handle fierce here, or set it as hook
      G.player[ctx.currentPlayer].field
        .filter((card) => isMonster(card))
        .map((card) => ((card as Monster).attacks = 1));
    },
    stages: {
      level: {
        moves: { levelUp, noLevel },
        next: 'activate',
      },
      activate: {
        moves: { activateSkill, noActivate },
        next: 'attack',
      },
      attack: { moves: { attack, noAttacks } },
      select: {
        moves: { selectTarget, confirmSkill, declineSkill },
      },
      confirmation: {
        moves: { confirmSkill, declineSkill },
      },
    },
  },

  minPlayers: 2,
  maxPlayers: 2,
};
