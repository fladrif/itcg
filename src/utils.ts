import { PlayerState } from "./game";
import { SkillRequirements } from "./card";

export function meetsSkillReq(req: SkillRequirements, P: PlayerState): boolean {
  if (req.level > P.level) return false;

  return true;
}
