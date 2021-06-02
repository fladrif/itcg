import { Character, CardTypes, CardClasses } from "../../card";

const defaultTypes = {
  type: CardTypes.Character,
  class: CardClasses.Warrior,
};

export const sherman: Character = {
  name: "Sherman",
  image: "Sherman",
  health: 240,
  skills: [
    {
      requirements: { level: 10 },
      action: "quest",
    },
    {
      requirements: { level: 20 },
      action: "quest",
    },
    {
      requirements: { level: 30 },
      action: "quest",
    },
  ],
  ...defaultTypes,
};
