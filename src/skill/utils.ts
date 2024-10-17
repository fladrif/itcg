import { SkillName, SkillRef } from './index';

export function skillRef(name: SkillName): SkillRef {
  return { name, activated: false };
}
