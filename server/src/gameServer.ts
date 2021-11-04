import axios from 'axios';
import Bluebird from 'bluebird';
import lodash from 'lodash';
import { LobbyAPI } from 'boardgame.io';

import { SERVER, GAME_NAME } from '../../src/config';
import { BLANK_CARDNAME, Character, NonCharacter } from '../../src/card';
import { cards, CardName } from '../../src/cards';

import { db } from './db';
import { Decks } from './dbTable';
import { Room, RoomUser } from './types';
import { SERVER_AUTH_HEADER, SERVER_CLIENT_HEADER, SERVER_ID, signJWT } from './utils';

export interface GamePlayerData {
  matchID: string;
  playerID: string;
  credentials?: string;
}

function getCard(name: string): Omit<Character | NonCharacter, 'owner' | 'key'> {
  for (const card in cards) {
    if (cards[card as CardName].name === name) return cards[card as CardName];
  }

  return cards['blankCard'];
}

export function updateDeck(deck: Decks): boolean {
  const updatedDeckList = deck.deck_list.deck.map((card) => {
    const isV1 = card[0].canonicalName === undefined;

    const updatedCard = isV1
      ? (getCard(card[0].name) as Omit<NonCharacter, 'owner' | 'key'>)
      : (cards[card[0].canonicalName] as Omit<NonCharacter, 'owner' | 'key'>);

    return [updatedCard, card[1]] as [Omit<NonCharacter, 'owner' | 'key'>, number];
  });

  const character = deck.deck_list.character;
  const updatedChar =
    character.canonicalName === undefined
      ? (getCard(character.name) as Omit<Character, 'owner' | 'key'>)
      : (cards[character.canonicalName] as Omit<Character, 'owner' | 'key'>);

  if (
    !updatedChar ||
    !updatedDeckList.reduce((acc, card) => acc && card[0].name !== BLANK_CARDNAME, true)
  ) {
    return false;
  }

  db.saveDeck(
    deck.id,
    deck.name,
    { character: updatedChar, deck: updatedDeckList },
    deck.owner ? deck.owner.username : undefined
  );

  return true;
}

export async function shouldStartGame(room: Room): Promise<boolean> {
  const validDecks = await Bluebird.reduce(
    room.users,
    async (acc, usr) => {
      if (!usr.deck) return false;

      const deckExist = await db.getDeck(usr.deck);
      const validDeck = !!deckExist ? updateDeck(deckExist) : false;

      return !!validDeck && acc;
    },
    true
  );

  return (
    validDecks &&
    room.users.length === 2 &&
    room.users.reduce<boolean>((acc, usr) => usr.ready && acc, true)
  );
}

export async function getGames(isGameover?: boolean): Promise<LobbyAPI.Match[]> {
  const params = isGameover !== undefined ? { isGameover } : {};

  const resp = await axios
    .get(`/games/${GAME_NAME}`, {
      baseURL: SERVER,
      timeout: 10000,
      headers: getServerHeaders(),
      params,
    })
    .catch((err) => {
      console.error(err);
    });

  if (!resp) return [];
  return resp.data.matches;
}

export async function startGame(room: Room) {
  const randUsers = lodash.shuffle(room.users);
  const players = await Bluebird.map(randUsers, async (usr, idx) => {
    const playerDeck = await db.getDeck(usr.deck!);
    return {
      id: idx,
      playerName: usr.name,
      deck: playerDeck!.deck_list,
    };
  });

  const resp = await axios
    .post(
      `/games/${GAME_NAME}/create`,
      {
        numPlayers: 2,
        setupData: { players },
      },
      {
        baseURL: SERVER,
        timeout: 10000,
        headers: getServerHeaders(),
      }
    )
    .catch((err) => {
      console.error(err);
    });

  if (!resp) return;

  const matchID = resp!.data.matchID;

  await joinGame(matchID, randUsers[0], 0);
  await joinGame(matchID, randUsers[1], 1);
}

async function joinGame(matchID: string, player: RoomUser, id: number): Promise<void> {
  const dbUser = await db.getUserByName(player.name);

  const clientHeader: Record<string, string> = {};
  clientHeader[SERVER_CLIENT_HEADER] = dbUser.id;

  await axios
    .post(
      `/games/${GAME_NAME}/${matchID}/join`,
      {
        playerName: player.name,
        playerID: id,
      },
      {
        baseURL: SERVER,
        timeout: 5000,
        headers: { ...getServerHeaders(), ...clientHeader },
      }
    )
    .catch((err) => {
      console.error(err);
    });
}

export async function inGame(userID: string): Promise<GamePlayerData | void> {
  const dbUser = await db.getUserByID(userID);
  const games = await getGames(false);

  if (games.length === 0) return;

  const game = games.find((game) => {
    return game.players.some((plr) => plr.name === dbUser.username);
  });
  if (!game) return;

  return {
    matchID: game.matchID,
    playerID: game.players.find((plr) => plr.name === dbUser.username)!.id.toString(),
  };
}

function getServerHeaders() {
  const headers: Record<string, string> = {};
  headers[SERVER_AUTH_HEADER] = signJWT(SERVER_ID);
  return headers;
}
