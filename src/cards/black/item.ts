import { Item, CardTypes, CardClasses } from "../../card";

const defaultTypes = {
  type: CardTypes.Item,
  class: CardClasses.Thief,
};

export const emeraldearrings: Item = {
  name: "emeraldearrings",
  image: "EmeraldEarrings",
  level: 30,
  skill: [{}],
  ability: {},
  ...defaultTypes,
};
