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

interface CardProp {
  card: Card;
}

const cardImages: Dictionary<any> = {
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

const miniCardStyle: React.CSSProperties = {
  height: "110px",
  width: "79px",
};

export class ITCGCard extends React.Component<CardProp> {
  render() {
    return (
      <div>
        <img
          style={miniCardStyle}
          src={cardImages[this.props.card.image]}
          alt={this.props.card.name}
        />
      </div>
    );
  }
}
