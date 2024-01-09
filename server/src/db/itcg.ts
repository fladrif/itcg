import { getITCGConnection } from './db';
import { Games } from './dbTable';

export async function getGames(): Promise<Games[]> {
  const connection = await getITCGConnection();

  const gameRepo = connection.getRepository(Games);
  const games = await gameRepo.find({
    select: ['gameover', 'createdAt'],
  });

  return games;
}
