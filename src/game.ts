import { Ctx, PlayerID } from 'boardgame.io';
import lodash from 'lodash';

import { instantiateCard, Character, NonCharacter } from './card';
import { hydrateDeck, nixieBase, shermanBase } from './decks';
import { resetMonsterDamageOnField } from './hook';
import {
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
import { TriggerStore, defaultTriggers } from './triggerStore';
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
  name: string;
  hp: number;
  maxHP: number;
  level: number;
  activationPos: number;
}

export interface SetupData {
  players: [{ id: PlayerID; playerName: string; deck: Deck }];
}

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

export function setup(_ctx: Ctx, setupData: SetupData): GameState {
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

export function playerView(
  G: GameState,
  _ctx: Ctx,
  playerID: PlayerID | null
): GameState {
  const playerIDs = Object.keys(G.player);

  const { player, ...restGame } = G;
  const newState: GameState = { player: {}, ...restGame };

  playerIDs.map((id) => {
    const { deck, hand, ...nonDeckState } = G.player[id];

    const playerDeck = scrubPile(G.player[id].deck);
    const playerHand = playerID === id ? hand : scrubPile(hand);

    newState.player[id] = { ...nonDeckState, deck: playerDeck, hand: playerHand };
  });

  return newState;
}

export const ITCG = {
  name: 'ITCG',

  setup,

  playerView,

  moves: {
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
        moves: { selectTarget, confirmSkill, resetStack },
      },
      choice: {
        moves: { selectChoice },
      },
      confirmation: {
        moves: { confirmSkill, resetStack },
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
