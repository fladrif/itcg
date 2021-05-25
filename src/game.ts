import { Ctx, PlayerID } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import lodash from "lodash";

import * as cards from "./card";
import { Card } from "./card";

declare global {
  interface Dictionary<T> {
    [Key: string]: T;
  }
}

const SAMPLE_DECK: Card[] = [
  cards.slime,
  cards.fairy,
  cards.jrnecki,
  cards.octopus,
  cards.redsnail,
  cards.wildboar,
  cards.magicclaw,
  cards.ribbonpig,
  cards.darkaxestump,
  cards.greenmushroom,
  cards.orangemushroom,
  cards.emeraldearrings,
];

interface Deck {
  character: Card;
  deck: Card[];
}

export interface PlayerState {
  deck: Deck;
  hand: Card[];
}

export interface SetupData {
  players: [{ id: PlayerID; deck: Card[] }];
}

export interface GameState {
  player: Dictionary<PlayerState>;
}

function drawCard(G: GameState, ctx: Ctx) {
  const player = G.player[ctx.currentPlayer];
  if (!player || player.deck.deck.length <= 0) return INVALID_MOVE;

  player.hand.push(player.deck.deck.pop()!);
}

function shuffleDeck(G: GameState, _ctx: Ctx, id: PlayerID) {
  const player = G.player[id];
  if (!player) return INVALID_MOVE;

  player.deck.deck = lodash(player.deck.deck).shuffle().value();
}

function preConfigSetup(): GameState {
  const state = { player: {} } as GameState;

  state.player["0"] = {
    deck: {
      character: cards.slime,
      deck: lodash(SAMPLE_DECK).shuffle().value(),
    },
    hand: [],
  };

  state.player["1"] = {
    deck: {
      character: cards.slime,
      deck: lodash(SAMPLE_DECK).shuffle().value(),
    },
    hand: [],
  };

  return state;
}

export function setup(_ctx: Ctx, setupData: SetupData): GameState {
  const state: GameState = { player: {} };

  for (const player of setupData.players) {
    state.player[player.id] = {
      deck: { character: cards.slime, deck: player.deck },
      hand: [],
    };
  }
  return state;
}

export const ITCG = {
  name: "ITCG",

  setup: preConfigSetup,

  moves: {
    drawCard,
    shuffleDeck,
  },

  turn: {
    moveLimit: 1,
  },

  minPlayers: 2,
  maxPlayers: 2,
};
