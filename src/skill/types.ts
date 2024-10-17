import { Action, ActionOpts } from '../actions';
import { ActionTargets } from '../target';
import { CardClasses } from '../card';
import { Choice } from '../stack';

export interface SkillRequirements {
  level: number;
  class?: Partial<Record<CardClasses, number>>;
  oneshot?: boolean;
}

export interface Skill {
  requirements: SkillRequirements;
  action: Action;
  /**
   * Can skill be skipped or undone. Set true for forced actions like targeted discard effects
   */
  noReset?: boolean;
  opts?: ActionOpts;
  targets?: ActionTargets;
  dialogPrompt?: string;
  choice?: Choice[];
}
