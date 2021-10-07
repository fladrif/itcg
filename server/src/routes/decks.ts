import Router from 'koa-router';
import { Server as ServerTypes } from 'boardgame.io';
import { v4 as uuidv4 } from 'uuid';

import { db } from '../db';
import { AUTH_HEADER } from '../utils';

import { validateDeck } from '../../../src/decks';

const router = new Router<any, ServerTypes.AppCtx>();

router.get('/', async (ctx: any) => {
  const userID = ctx.header[AUTH_HEADER];
  const decks = await db.getDecks(userID);

  ctx.body = decks.map((deck) => {
    return {
      id: deck.id,
      name: deck.name,
      deck_list: deck.deck_list,
      modify: !!deck.owner,
    };
  });
});

router.get('/:id', async (ctx: any) => {
  const userID = ctx.header[AUTH_HEADER];
  const deckID = ctx.params.id;

  const deck = await db.getDeck(deckID);

  if (!deck || deck.owner?.id !== userID) ctx.throw(400, 'Cannot get deck');

  ctx.body = deck!;
});

router.post('/upsert', async (ctx: any) => {
  const userID = ctx.header[AUTH_HEADER];

  const deckID = ctx.request.body['deckId'] ?? uuidv4();
  const deckName = ctx.request.body['deckName'];
  const deckList = ctx.request.body['deckList'];

  if (!deckName) ctx.throw(400, 'Missing deck name');

  if (!validateDeck(deckList))
    ctx.throw(400, 'Invalid deck: Min 40 cards, Max 4 copies per card');

  const deck = await db.getDeck(deckID);

  if (deck && deck.owner?.id !== userID) ctx.throw(400, 'Cannot modify deck');

  await db.saveDeck(deckID, deckName, deckList, userID);

  ctx.body = 200;
});

router.post('/delete', async (ctx: any) => {
  const userID = ctx.header[AUTH_HEADER];
  const deckID = ctx.request.body['deckId'];

  if (!deckID) ctx.throw(400, 'Not a saved deck: no id');

  const deck = await db.getDeck(deckID);
  if (!deck || deck.owner?.id !== userID) return ctx.throw(400, 'Cannot delete deck');

  await db.deleteDeck(deck);

  ctx.body = 200;
});

export { router as DeckRouter };
