import { v4 as uuidv4 } from 'uuid';

import { Settings } from './dbTable';
import { getConnection } from './db';
import { getUserByID } from './users';

import { PlayerSettings } from '../../../src/game';

export async function getSettingByPlayerId(
  playerId: string
): Promise<Settings | undefined> {
  const connection = await getConnection();

  const settingRepo = connection.getRepository(Settings);
  const setting = await settingRepo.findOne({
    relations: ['owner'],
    where: { owner: playerId },
  });

  return setting;
}

export async function saveSettings(
  playerId: string,
  settings: PlayerSettings
): Promise<void> {
  const connection = await getConnection();
  const settingRepo = connection.getRepository(Settings);

  const existingSetting = await getSettingByPlayerId(playerId);

  if (!existingSetting) {
    const user = await getUserByID(playerId);
    await settingRepo.save(new Settings(uuidv4(), settings, user));
  } else {
    existingSetting.settings = settings;
    existingSetting.modified_at = new Date();

    await settingRepo.save(existingSetting);
  }
}
