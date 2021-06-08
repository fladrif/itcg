import { Ctx, PlayerID } from "boardgame.io";
import lodash from "lodash";

import * as cards from "./cards";
import { Character, NonCharacter } from "./card";
import {
  shuffleDeck,
  levelUp,
  noLevel,
  activateSkill,
  noActivate,
  selectTarget,
  confirmSkill,
  declineSkill,
  noAttacks,
} from "./moves";
import { Stack } from "./stack";

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
  board: NonCharacter[];
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

  state.player["0"] = {
    deck: {
      character: cards.sherman,
      deck: lodash(SAMPLE_DECK).shuffle().value(),
    },
    hand: [],
    learnedSkills: [],
    board: [],
    hp: cards.sherman.health,
    maxHP: cards.sherman.health,
    level: 0,
    activationPos: 0,
  };

  state.player["1"] = {
    deck: {
      character: cards.nixie,
      deck: lodash(SAMPLE_DECK).shuffle().value(),
    },
    hand: [],
    learnedSkills: [],
    board: [],
    hp: cards.nixie.health,
    maxHP: cards.nixie.health,
    level: 0,
    activationPos: 0,
  };

  state.player["0"].hand.push(state.player["0"].deck.deck.pop()!);
  state.player["0"].hand.push(state.player["0"].deck.deck.pop()!);
  state.player["0"].hand.push(state.player["0"].deck.deck.pop()!);
  state.player["0"].hand.push(state.player["0"].deck.deck.pop()!);

  state.player["1"].hand.push(state.player["1"].deck.deck.pop()!);
  state.player["1"].hand.push(state.player["1"].deck.deck.pop()!);
  state.player["1"].hand.push(state.player["1"].deck.deck.pop()!);
  state.player["1"].hand.push(state.player["1"].deck.deck.pop()!);
  state.player["1"].hand.push(state.player["1"].deck.deck.pop()!);

  return state;
}

export function setup(_ctx: Ctx, setupData: SetupData): GameState {
  const state: GameState = {
    player: {},
  };

  for (const player of setupData.players) {
    state.player[player.id] = {
      deck: { character: cards.sherman, deck: player.deck.deck },
      hand: [],
      learnedSkills: [],
      board: [],
      hp: cards.sherman.health,
      maxHP: cards.sherman.health,
      level: 0,
      activationPos: 0,
    };
  }
  return state;
}

export const ITCG = {
  name: "ITCG",

  setup: preConfigSetup,

  moves: {
    shuffleDeck,
    levelUp,
    activateSkill,
  },

  turn: {
    onBegin: (_G: GameState, ctx: Ctx) => {
      ctx.events!.setActivePlayers!({ currentPlayer: "level" });
    },
    stages: {
      level: {
        moves: { levelUp, noLevel },
        next: "activate",
      },
      activate: {
        moves: { activateSkill, noActivate },
        next: "attack",
      },
      attack: { moves: { noAttacks } },
      select: {
        moves: { selectTarget },
      },
      confirmation: {
        moves: { confirmSkill, declineSkill },
      },
    },
  },

  minPlayers: 2,
  maxPlayers: 2,
};
