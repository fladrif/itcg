import { Tactic, CardTypes, CardClasses } from "../../card";

const defaultTypes = {
  type: CardTypes.Tactic,
  class: CardClasses.Magician,
};

export const magicclaw: Tactic = {
  name: "Magic Claw",
  image: "MagicClaw",
  level: 20,
  skill: [{}],
  ability: {},
  ...defaultTypes,
};
