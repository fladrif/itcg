import React from "react";

import { Card } from "./card";

import Slime from "./images/Slime.jpg";
import Fairy from "./images/Fairy.jpg";
import JrNecki from "./images/JrNecki.jpg";
import Octopus from "./images/Octopus.jpg";
import RedSnail from "./images/RedSnail.jpg";
import WildBoar from "./images/WildBoar.jpg";
import MagicClaw from "./images/MagicClaw.jpg";
import RibbonPig from "./images/RibbonPig.jpg";
import DarkAxeStump from "./images/DarkAxeStump.jpg";
import GreenMushroom from "./images/GreenMushroom.jpg";
import OrangeMushroom from "./images/OrangeMushroom.jpg";
import EmeraldEarrings from "./images/EmeraldEarrings.jpg";
import Sherman from "./images/Sherman.jpg";
import Nixie from "./images/Nixie.jpg";
import Cardback from "./images/cardback.jpg";

type Styles = keyof typeof styles;

interface CardProp {
  style?: Styles;
  onClick?: () => void;
  card: Card;
}

const cardImages: Record<string, any> = {
  Slime,
  Fairy,
  JrNecki,
  Octopus,
  RedSnail,
  WildBoar,
  MagicClaw,
  RibbonPig,
  DarkAxeStump,
  GreenMushroom,
  OrangeMushroom,
  EmeraldEarrings,
  Sherman,
  Nixie,
  Cardback,
};

const styles = {
  leveledCardStyle: {
    objectFit: "cover",
    objectPosition: "0 100%",
    height: "10%",
    width: "70%",
  } as React.CSSProperties,
  characterStyle: {
    width: "70%",
  } as React.CSSProperties,
  miniCardStyle: {
    height: "110px",
    width: "79px",
  } as React.CSSProperties,
};

export class ITCGCard extends React.Component<CardProp> {
  render() {
    const style = this.props.style ?? "miniCardStyle";

    return (
      <img
        onClick={this.props.onClick}
        style={styles[style]}
        src={cardImages[this.props.card.image]}
        alt={this.props.card.name}
      />
    );
  }
}
