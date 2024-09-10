import { Not, IsNull } from 'typeorm';
import { getITCGConnection } from './db';
import { Games } from './dbTable';

const DAY = 1000 * 60 * 60 * 24;

export async function getGames(): Promise<Games[]> {
  const connection = await getITCGConnection();

  const gameRepo = connection.getRepository(Games);
  const games = await gameRepo.find({
    select: ['gameover', 'createdAt', 'updatedAt'],
  });

  return games;
}

export async function getLatestGames(): Promise<{ complete: any[]; ongoing: any[] }> {
  const connection = await getITCGConnection();

  const gameRepo = connection.getRepository(Games);
  const games = await gameRepo.find({
    select: ['gameover', 'updatedAt', 'players'],
    order: { createdAt: 'DESC' },
    where: { gameover: Not(IsNull()) },
    take: 3,
  });

  const complete = games.map((g) => {
    const winner = g.gameover!.winner === '0' ? '0' : '1';
    const loser = winner === '0' ? '1' : '0';
    return {
      ended: g.updatedAt,
      winner: g.players[winner].name,
      loser: g.players[loser].name,
    };
  });

  const ongoingGames = await gameRepo.find({
    select: ['id', 'gameover', 'updatedAt', 'players'],
    order: { createdAt: 'DESC' },
    where: { gameover: IsNull() },
  });

  const ongoing = ongoingGames.map((g) => {
    const age = (Date.now() - new Date(g.updatedAt).getTime()) / DAY;
    return { id: g.id, p1: g.players[0].name, p2: g.players[1].name, age };
  });

  return { complete, ongoing };
}

export async function deleteOngoingGame(id: string): Promise<void> {
  const connection = await getITCGConnection();

  const gameRepo = connection.getRepository(Games);

  const ongoingGame = await gameRepo.find({
    select: ['id'],
    where: { gameover: IsNull(), id },
  });

  if (ongoingGame.length <= 0) return;

  await gameRepo.delete({ id });
}
