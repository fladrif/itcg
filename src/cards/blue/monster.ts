import { Monster, CardTypes, CardClasses } from "../../card";
import { SAMPLE_SKILL } from "../../card";

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Warrior,
  selected: false,
};

export const wildboar: Monster = {
  name: "Wild Boar",
  image: "WildBoar",
  level: 25,
  attack: 30,
  health: 30,
  skill: SAMPLE_SKILL,
  ability: {},
  ...defaultTypes,
};

export const slime: Monster = {
  name: "Slime",
  image: "Slime",
  level: 6,
  attack: 10,
  health: 10,
  skill: SAMPLE_SKILL,
  ability: {},
  ...defaultTypes,
};

export const greenmushroom: Monster = {
  name: "Green Mushroom",
  image: "GreenMushroom",
  level: 15,
  attack: 10,
  health: 40,
  skill: SAMPLE_SKILL,
  ability: {},
  ...defaultTypes,
};

export const ribbonpig: Monster = {
  name: "Ribbon Pig",
  image: "RibbonPig",
  level: 10,
  attack: 20,
  health: 20,
  skill: SAMPLE_SKILL,
  ability: {},
  ...defaultTypes,
};
