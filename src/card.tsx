import React from "react";
import { Card } from "./cardList";

interface CardProp {
  card: Card;
}

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
          src={this.props.card.image}
          alt={this.props.card.name}
        />
      </div>
    );
  }
}
