import { Character, CardTypes, CardClasses } from "../../card";

const defaultTypes = {
  type: CardTypes.Character,
  class: CardClasses.Bowman,
};

export const nixie: Character = {
  name: "Nixie",
  image: "Nixie",
  health: 200,
  skills: [
    {
      requirements: { level: 10 },
      action: "quest",
      targets: [],
    },
    {
      requirements: { level: 20 },
      action: "quest",
      targets: [],
    },
    {
      requirements: { level: 30 },
      action: "quest",
      targets: [],
    },
  ],
  ...defaultTypes,
};
