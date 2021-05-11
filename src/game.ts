import { Ctx, PlayerID } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import lodash from "lodash";

declare global {
  interface Dictionary<T> {
    [Key: string]: T;
  }
}

const SAMPLE_DECK = [
  { id: 0 },
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
];

export interface Card {
  id: number;
}

export interface PlayerState {
  deck: Card[];
  hand: Card[];
}

export interface SetupData {
  players: [{ id: PlayerID }];
}

export interface GameState {
  player: Dictionary<PlayerState>;
}

function drawCard(G: GameState, ctx: Ctx) {
  const player = G.player[ctx.currentPlayer];
  if (!player || player.deck.length <= 0) return INVALID_MOVE;

  player.hand.push(player.deck.pop()!);
}

function shuffleDeck(G: GameState, _ctx: Ctx, id: PlayerID) {
  const player = G.player[id];
  if (!player) return INVALID_MOVE;

  player.deck = lodash(player.deck).shuffle().value();
}

function preConfigSetup(): GameState {
  const state = { player: {} } as GameState;

  state.player["0"] = {
    deck: lodash(SAMPLE_DECK).shuffle().value(),
    hand: [],
  };

  state.player["1"] = {
    deck: lodash(SAMPLE_DECK).shuffle().value(),
    hand: [],
  };

  return state;
}

export function setup(_ctx: Ctx, setupData: SetupData): GameState {
  const state: GameState = { player: {} };

  for (const player of setupData.players) {
    state.player[player.id] = {
      deck: SAMPLE_DECK,
      hand: [],
    };
  }
  return state;
}

export function playerView(
  G: GameState,
  _ctx: Ctx,
  playerID: PlayerID
): GameState {
  const opponentID = Object.keys(G.player).filter((id) => id !== playerID)[0];

  G.player[opponentID].deck = Array(G.player[opponentID].deck.length);
  G.player[opponentID].hand = Array(G.player[opponentID].hand.length);
  G.player[playerID].deck = Array(G.player[playerID].deck.length);

  return G;
}

export const ITCG = {
  name: "ITCG",

  setup: preConfigSetup,

  playerView,

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
