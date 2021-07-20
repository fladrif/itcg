import { Ctx, PlayerID } from 'boardgame.io';
import lodash from 'lodash';

import * as cards from './cards';
import { instantiateCard, Character, NonCharacter } from './card';
import { hydrateDeck, nixieBase, shermanBase } from './decks';
import { resetMonsterDamageOnField } from './hook';
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

export const SAMPLE_DECK: NonCharacter[] = [
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

export interface Deck {
  character: Omit<Character, 'key' | 'owner'>;
  deck: [Omit<NonCharacter, 'key' | 'owner'>, number][];
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
    deck: lodash(hydrateDeck(shermanBase, '0')).shuffle().value(),
    character: instantiateCard(shermanBase.character, '0')[0],
    hand: [],
    learnedSkills: [],
    field: [],
    discard: [],
    hp: shermanBase.character.health,
    maxHP: shermanBase.character.health,
    level: 0,
    activationPos: 0,
  };

  state.player['1'] = {
    deck: lodash(hydrateDeck(nixieBase, '1')).shuffle().value(),
    character: instantiateCard(nixieBase.character, '1')[0],
    hand: [],
    learnedSkills: [],
    field: [],
    discard: [],
    hp: nixieBase.character.health,
    maxHP: nixieBase.character.health,
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
      deck: hydrateDeck(player.deck, player.id),
      character: instantiateCard(player.deck.character, player.id)[0],
      hand: [],
      learnedSkills: [],
      field: [],
      discard: [],
      hp: player.deck.character.health,
      maxHP: player.deck.character.health,
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
    onBegin: (_G: GameState, ctx: Ctx) => {
      ctx.events!.setActivePlayers!({ currentPlayer: 'level' });
    },
    onEnd: (G: GameState, ctx: Ctx) => {
      resetMonsterDamageOnField(G, ctx);
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
