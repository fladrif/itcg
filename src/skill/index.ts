import * as bowman from './bowman';
import * as magician from './magician';
import * as thief from './thief';
import * as warrior from './warrior';
import * as common from './common';

export * from './utils';

export const skillDict = { ...bowman, ...magician, ...thief, ...warrior, ...common };

export type SkillName = keyof typeof skillDict;

export interface SkillRef {
  name: SkillName;
  /**
   * Used for UI drawing, always set to false manually
   */
  activated: boolean;
}
