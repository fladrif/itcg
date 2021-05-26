import { Ctx, PlayerID } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import lodash from "lodash";

import * as cards from "./cards";
import { Character, NonCharacter } from "./card";

const SAMPLE_DECK: NonCharacter[] = [
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
  character: Character;
  deck: NonCharacter[];
}

export interface PlayerState {
  deck: Deck;
  hand: NonCharacter[];
  learnedSkills: NonCharacter[];
  hp: number;
  maxHP: number;
  level: number;
}

export interface SetupData {
  players: [{ id: PlayerID; deck: Deck }];
}

export interface GameState {
  player: Record<PlayerID, PlayerState>;
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
      character: cards.sherman,
      deck: lodash(SAMPLE_DECK).shuffle().value(),
    },
    hand: [],
    learnedSkills: [],
    hp: cards.sherman.health,
    maxHP: cards.sherman.health,
    level: 0,
  };

  state.player["1"] = {
    deck: {
      character: cards.nixie,
      deck: lodash(SAMPLE_DECK).shuffle().value(),
    },
    hand: [],
    learnedSkills: [],
    hp: cards.nixie.health,
    maxHP: cards.nixie.health,
    level: 0,
  };

  return state;
}

export function setup(_ctx: Ctx, setupData: SetupData): GameState {
  const state: GameState = { player: {} };

  for (const player of setupData.players) {
    state.player[player.id] = {
      deck: { character: cards.sherman, deck: player.deck.deck },
      hand: [],
      learnedSkills: [],
      hp: cards.sherman.health,
      maxHP: cards.sherman.health,
      level: 0,
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
