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
import { TriggerStore, defaultTriggers } from './triggerStore';
import { getOpponentID } from './utils';

const SAMPLE_DECK_0: NonCharacter[] = [
  ...instantiateCard(cards.slime, '0'),
  ...instantiateCard(cards.fairy, '0'),
  ...instantiateCard(cards.jrnecki, '0'),
  ...instantiateCard(cards.octopus, '0'),
  ...instantiateCard(cards.redsnail, '0'),
  ...instantiateCard(cards.wildboar, '0'),
  ...instantiateCard(cards.magicclaw, '0'),
  ...instantiateCard(cards.ribbonpig, '0', 4),
  ...instantiateCard(cards.darkaxestump, '0'),
  ...instantiateCard(cards.greenmushroom, '0'),
  ...instantiateCard(cards.orangemushroom, '0', 4),
  ...instantiateCard(cards.emeraldearrings, '0'),
];

const SAMPLE_DECK_1: NonCharacter[] = [
  ...instantiateCard(cards.slime, '1'),
  ...instantiateCard(cards.fairy, '1', 4),
  ...instantiateCard(cards.jrnecki, '1'),
  ...instantiateCard(cards.octopus, '1'),
  ...instantiateCard(cards.redsnail, '1'),
  ...instantiateCard(cards.wildboar, '1'),
  ...instantiateCard(cards.magicclaw, '1'),
  ...instantiateCard(cards.ribbonpig, '1'),
  ...instantiateCard(cards.darkaxestump, '1'),
  ...instantiateCard(cards.greenmushroom, '1'),
  ...instantiateCard(cards.orangemushroom, '1'),
  ...instantiateCard(cards.emeraldearrings, '1'),
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
  discard: NonCharacter[];
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
  triggers: TriggerStore[];
}

function preConfigSetup(): GameState {
  const state: GameState = { player: {}, triggers: [...defaultTriggers] };

  state.player['0'] = {
    deck: lodash(SAMPLE_DECK_0).shuffle().value(),
    character: instantiateCard(cards.sherman, '0')[0],
    hand: [],
    learnedSkills: [],
    field: [],
    discard: [],
    hp: cards.sherman.health,
    maxHP: cards.sherman.health,
    level: 0,
    activationPos: 0,
  };

  state.player['1'] = {
    deck: lodash(SAMPLE_DECK_1).shuffle().value(),
    character: instantiateCard(cards.nixie, '1')[0],
    hand: [],
    learnedSkills: [],
    field: [],
    discard: [],
    hp: cards.nixie.health,
    maxHP: cards.nixie.health,
    level: 0,
    activationPos: 0,
  };

  state.player['0'].hand.push(state.player['0'].deck.pop()!);
  state.player['0'].hand.push(state.player['0'].deck.pop()!);
  state.player['0'].hand.push(state.player['0'].deck.pop()!);
  state.player['0'].hand.push(state.player['0'].deck.pop()!);
  state.player['0'].hand.push(state.player['0'].deck.pop()!);

  state.player['1'].hand.push(state.player['1'].deck.pop()!);
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
    triggers: [],
  };

  for (const player of setupData.players) {
    state.player[player.id] = {
      deck: player.deck.deck,
      character: instantiateCard(cards.sherman, player.id)[0],
      hand: [],
      learnedSkills: [],
      field: [],
      discard: [],
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
        .map((card) => {
          (card as Monster).attacks = 1;
          (card as Monster).damageTaken = 0;
        });
      G.player[ctx.currentPlayer].discard
        .filter((card) => isMonster(card))
        .map((card) => ((card as Monster).damageTaken = 0));
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

  endIf: (G: GameState, ctx: Ctx) => {
    const opponentID = getOpponentID(G, ctx);

    if (G.player[ctx.currentPlayer].hp <= 0) {
      return { winner: opponentID };
    } else if (G.player[opponentID].hp <= 0) {
      return { winner: ctx.currentPlayer };
    }
  },

  minPlayers: 2,
  maxPlayers: 2,
};
