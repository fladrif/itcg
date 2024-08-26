import { randomInt } from 'crypto';
import { shuffle } from 'lodash';

export const single = [
  "PLAYER is contemplating their deck's strategy",
  'PLAYER is shuffling their deck intently',
  'PLAYER is looking around for an opponent',
  'PLAYER is wondering if you want to play',
  'PLAYER is getting ready and resleeving their deck',
  'PLAYER is staring into space.. waiting..',
  'PLAYER is flicking their cards impatiently',
  "PLAYER is hoping their next opponent doesn't play Buffy",
];

export const pair = [
  'PLAYER is staring down PLAYER',
  'PLAYER is trash talking PLAYER',
  'PLAYER is chatting with PLAYER',
  "PLAYER is looking through PLAYER's cards",
  "PLAYER is admiring PLAYER's foiled deck",
  "PLAYER is shuffling PLAYER's deck",
  'PLAYER and PLAYER are discussing strategies',
  'PLAYER and PLAYER are rolling dice',
  'Sparks are flying inbetween PLAYER and PLAYER!',
];

export function getMessage(player: string, opp?: string): string {
  if (!opp) return template(single[randomInt(single.length)], [player]);

  return template(pair[randomInt(pair.length)], [player, opp]);
}

function template(message: string, players: string[]): string {
  const randomizedPlayers = shuffle(players);
  const templatedOnce = message.replace('PLAYER', randomizedPlayers[0]);

  if (randomizedPlayers.length === 1) return templatedOnce;
  return templatedOnce.replace('PLAYER', randomizedPlayers[1]);
}
