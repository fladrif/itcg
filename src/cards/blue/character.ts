import { Character, CardTypes, CardClasses } from "../../card";

const defaultTypes = {
  type: CardTypes.Character,
  class: CardClasses.Warrior,
};

export const sherman: Character = {
  name: "Sherman",
  image: "Sherman",
  health: 240,
  skills: [{}],
  ...defaultTypes,
};
