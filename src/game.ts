import { Ctx, FnContext, PlayerID } from 'boardgame.io';
import lodash from 'lodash';

import { instantiateCard, Character, NonCharacter } from './card';
import { hydrateDeck, nixieBase, shermanBase } from './decks';
import { resetMonsterDamageOnField } from './hook';
import {
  concede,
  levelUp,
  noLevel,
  activateSkill,
  noActivate,
  selectTarget,
  selectChoice,
  confirmSkill,
  resetStack,
  attack,
  noAttacks,
} from './moves';
import { Stack } from './stack';
import { GlobalState } from './state';
import { TriggerStore, defaultTriggers } from './trigger';
import { getOpponentID, scrubPile } from './utils';

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
  temporary: NonCharacter[];
  name: string;
  hp: number;
  maxHP: number;
  level: number;
  activationPos: number;
}

export interface SetupPlayerData {
  id: PlayerID;
  playerName: string;
  deck: Deck;
}

export interface SetupData {
  players: SetupPlayerData[];
}

export type FuncContext = FnContext<GameState>;

export interface GameState {
  player: Record<PlayerID, PlayerState>;
  triggers: TriggerStore[];
  state: GlobalState[];
  stack?: Stack;
}

export function preConfigSetup(): GameState {
  const state: GameState = { player: {}, triggers: [...defaultTriggers], state: [] };

  state.player['0'] = {
    deck: lodash(hydrateDeck(shermanBase, '0')).shuffle().value(),
    character: instantiateCard(shermanBase.character, '0')[0],
    hand: [],
    learnedSkills: [],
    field: [],
    discard: [],
    temporary: [],
    hp: shermanBase.character.health,
    maxHP: shermanBase.character.health,
    level: 0,
    activationPos: 0,
    name: 'Detheroth',
  };

  state.player['1'] = {
    deck: lodash(hydrateDeck(nixieBase, '1')).shuffle().value(),
    character: instantiateCard(nixieBase.character, '1')[0],
    hand: [],
    learnedSkills: [],
    field: [],
    discard: [],
    temporary: [],
    hp: nixieBase.character.health,
    maxHP: nixieBase.character.health,
    level: 0,
    activationPos: 0,
    name: 'shinZ',
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

interface SetupCtx {
  ctx: Ctx;
}

export function setup(_context: SetupCtx, setupData: SetupData): GameState {
  const state: GameState = {
    player: {},
    triggers: [...defaultTriggers],
    state: [],
  };

  for (const player of setupData.players) {
    state.player[player.id] = {
      deck: lodash(hydrateDeck(player.deck, player.id)).shuffle().value(),
      character: instantiateCard(player.deck.character, player.id)[0],
      hand: [],
      learnedSkills: [],
      field: [],
      discard: [],
      temporary: [],
      hp: player.deck.character.health,
      maxHP: player.deck.character.health,
      level: 0,
      activationPos: 0,
      name: player.playerName,
    };
  }

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

interface PlayerViewCtx {
  G: GameState;
  ctx: Ctx;
  playerID: PlayerID | null;
}

// TODO: Handle temporary zones
export function playerView(context: PlayerViewCtx): GameState {
  const { G, playerID } = context;
  const playerIDs = Object.keys(G.player);

  const { player, ...restGame } = G;
  const newState: GameState = { player: {}, ...restGame };

  const curPlayer = playerID ? playerID : undefined;

  playerIDs.map((id) => {
    const { deck, hand, ...nonDeckState } = G.player[id];

    const playerDeck = scrubPile(G.player[id].deck, curPlayer);
    const playerHand = curPlayer === id ? hand : scrubPile(hand, curPlayer);

    newState.player[id] = { ...nonDeckState, deck: playerDeck, hand: playerHand };
  });

  return newState;
}

export const ITCG = {
  name: 'ITCG',

  setup,

  playerView,

  turn: {
    onBegin: ({ events }: FuncContext) => {
      events.setActivePlayers({ currentPlayer: 'level', others: 'unactive' });
    },
    onEnd: (fnCtx: FuncContext) => {
      resetMonsterDamageOnField(fnCtx);
    },
    stages: {
      level: {
        moves: { levelUp, noLevel, concede },
        next: 'activate',
      },
      activate: {
        moves: { activateSkill, noActivate, concede },
        next: 'attack',
      },
      attack: { moves: { attack, noAttacks, concede } },
      select: {
        moves: { selectTarget, confirmSkill, resetStack, concede },
      },
      choice: {
        moves: { selectChoice, concede },
      },
      confirmation: {
        moves: { confirmSkill, resetStack, concede },
      },
      unactive: {
        moves: { concede },
      },
    },
  },

  endIf: (fnCtx: FuncContext) => {
    const { G, ctx } = fnCtx;
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
