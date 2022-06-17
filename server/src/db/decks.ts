import { getConnection } from './db';
import { Decks } from './dbTable';
import { getUserByID } from './users';

import { Deck } from '../../../src/game';

interface DeckCount {
  created_at: Date;
  modified_at: Date;
}

export async function getDeckCount(): Promise<DeckCount[]> {
  const connection = await getConnection();

  const deck = connection.getRepository(Decks);
  return deck.find({ select: ['created_at', 'modified_at'] });
}

export async function getDecks(userID: string): Promise<Decks[]> {
  const connection = await getConnection();

  const dec = connection.getRepository(Decks);
  const decs = await dec.find({
    relations: ['owner'],
    where: [{ owner: userID }, { owner: null }],
    order: { owner: 'ASC', modified_at: 'DESC' },
  });

  return decs;
}

export async function getDeck(id: string): Promise<Decks | undefined> {
  const connection = await getConnection();

  const dec = connection.getRepository(Decks);
  const deck = await dec.findOne({ relations: ['owner'], where: { id } });
  return deck;
}

export async function saveDeck(
  id: string,
  name: string,
  deckList: Deck,
  owner?: string
): Promise<string> {
  const connection = await getConnection();

  const user = owner ? await getUserByID(owner) : undefined;

  const dec = connection.getRepository(Decks);
  const existingDeck = await dec.findOne({ id });

  if (!existingDeck) {
    await dec.save(new Decks(id, name, deckList, user));
  } else if (existingDeck.name !== name || existingDeck.deck_list !== deckList) {
    existingDeck.name = name;
    existingDeck.deck_list = deckList;
    existingDeck.modified_at = new Date();

    await dec.save(existingDeck);
  }

  return id;
}

export async function deleteDeck(deck: Decks): Promise<void> {
  const connection = await getConnection();

  const dec = connection.getRepository(Decks);
  await dec.delete(deck.id);
}
