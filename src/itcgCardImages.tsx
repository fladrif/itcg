import TopSlime from './images/top-Slime.jpg';
import SkillSlime from './images/skill-Slime.jpg';
import TopFairy from './images/top-Fairy.jpg';
import SkillFairy from './images/skill-Fairy.jpg';
import TopJrNecki from './images/top-JrNecki.jpg';
import SkillJrNecki from './images/skill-JrNecki.jpg';
import TopOctopus from './images/top-Octopus.jpg';
import SkillOctopus from './images/skill-Octopus.jpg';
import TopRedSnail from './images/top-RedSnail.jpg';
import SkillRedSnail from './images/skill-RedSnail.jpg';
import TopWildBoar from './images/top-WildBoar.jpg';
import SkillWildBoar from './images/skill-WildBoar.jpg';
import TopMagicClaw from './images/top-MagicClaw.jpg';
import SkillMagicClaw from './images/skill-MagicClaw.jpg';
import TopRibbonPig from './images/top-RibbonPig.jpg';
import SkillRibbonPig from './images/skill-RibbonPig.jpg';
import TopDarkAxeStump from './images/top-DarkAxeStump.jpg';
import SkillDarkAxeStump from './images/skill-DarkAxeStump.jpg';
import TopGreenMushroom from './images/top-GreenMushroom.jpg';
import SkillGreenMushroom from './images/skill-GreenMushroom.jpg';
import TopOrangeMushroom from './images/top-OrangeMushroom.jpg';
import SkillOrangeMushroom from './images/skill-OrangeMushroom.jpg';
import TopEmeraldEarrings from './images/top-EmeraldEarrings.jpg';
import SkillEmeraldEarrings from './images/skill-EmeraldEarrings.jpg';
import TopSherman from './images/top-Sherman.jpg';
import SkillSherman from './images/skill1-Sherman.jpg';
import Skill2Sherman from './images/skill2-Sherman.jpg';
import Skill3Sherman from './images/skill3-Sherman.jpg';
import TopNixie from './images/top-Nixie.jpg';
import SkillNixie from './images/skill1-Nixie.jpg';
import Skill2Nixie from './images/skill2-Nixie.jpg';
import Skill3Nixie from './images/skill3-Nixie.jpg';
import Cardback from './images/cardback.jpg';

interface CardImages {
  top: any;
  skill: any;
  skill2?: any;
  skill3?: any;
}

export const cardImages: Record<string, CardImages> = {
  Slime: {
    top: TopSlime,
    skill: SkillSlime,
  },
  Fairy: {
    top: TopFairy,
    skill: SkillFairy,
  },
  JrNecki: {
    top: TopJrNecki,
    skill: SkillJrNecki,
  },
  Octopus: {
    top: TopOctopus,
    skill: SkillOctopus,
  },
  RedSnail: {
    top: TopRedSnail,
    skill: SkillRedSnail,
  },
  WildBoar: {
    top: TopWildBoar,
    skill: SkillWildBoar,
  },
  MagicClaw: {
    top: TopMagicClaw,
    skill: SkillMagicClaw,
  },
  RibbonPig: {
    top: TopRibbonPig,
    skill: SkillRibbonPig,
  },
  DarkAxeStump: {
    top: TopDarkAxeStump,
    skill: SkillDarkAxeStump,
  },
  GreenMushroom: {
    top: TopGreenMushroom,
    skill: SkillGreenMushroom,
  },
  OrangeMushroom: {
    top: TopOrangeMushroom,
    skill: SkillOrangeMushroom,
  },
  EmeraldEarrings: {
    top: TopEmeraldEarrings,
    skill: SkillEmeraldEarrings,
  },
  Sherman: {
    top: TopSherman,
    skill: SkillSherman,
    skill2: Skill2Sherman,
    skill3: Skill3Sherman,
  },
  Nixie: {
    top: TopNixie,
    skill: SkillNixie,
    skill2: Skill2Nixie,
    skill3: Skill3Nixie,
  },
};

export const cardback = Cardback;
