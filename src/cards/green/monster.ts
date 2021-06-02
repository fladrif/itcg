import { Monster, CardTypes, CardClasses } from "../../card";
import { SAMPLE_SKILL } from "../../card";

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Bowman,
};

export const fairy: Monster = {
  name: "Fairy",
  image: "Fairy",
  level: 30,
  attack: 30,
  health: 20,
  skill: SAMPLE_SKILL,
  ability: {},
  ...defaultTypes,
};
