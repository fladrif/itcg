import { Ctx } from 'boardgame.io';

import { Location } from './index';
import { isMonster, Monster, NonCharacter } from '../card';
import { GameState } from '../game';
import { upsertStack, parseSkill } from '../stack';
import { removeGlobalState } from '../state';
import { pruneTriggerStore, pushTriggerStore } from '../triggerStore';
import { getCardAtLocation, getCardLocation, rmCard } from '../utils';

export function handleAbility(G: GameState, ctx: Ctx, card: NonCharacter): any {
  if (card.ability.triggers) {
    card.ability.triggers.map((trigger) =>
      pushTriggerStore(G, ctx, trigger.name, card, trigger.opts)
    );
  }

  if (card.ability.skills) {
    card.ability.skills.map((skill, idx) => {
      if (idx === 0) {
        upsertStack(G, ctx, [parseSkill(skill, card)]);
      } else {
        G.stack!.queuedDecisions.push(parseSkill(skill, card));
      }
    });
  }

  if (card.ability.state) {
    G.state.push({
      owner: card.key,
      player: card.owner,
      targets: card.ability.state.targets,
      modifier: card.ability.state.modifier,
    });
  }
}

export function handleCardLeaveField(
  G: GameState,
  ctx: Ctx,
  card: NonCharacter,
  location: Location
) {
  pruneTriggerStore(G, ctx, card.key);
  rmCard(G, ctx, card, location);
  resetMonsterDamage(G, ctx, card);
  removeGlobalState(G, ctx, card);
}

function resetMonsterDamage(G: GameState, ctx: Ctx, card: NonCharacter) {
  if (!isMonster(card)) return;

  const newLocation = getCardLocation(G, ctx, card.key);
  const c = getCardAtLocation(G, ctx, newLocation, card.key);
  (c as Monster).damageTaken = 0;
}
