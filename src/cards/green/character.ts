import { Character, CardTypes, CardClasses } from "../../card";

const defaultTypes = {
  type: CardTypes.Character,
  class: CardClasses.Bowman,
};

export const nixie: Character = {
  name: "Nixie",
  image: "Nixie",
  health: 200,
  skills: [{}],
  ...defaultTypes,
};
