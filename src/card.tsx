import React from "react";
import back from "./images/cardback.jpg";
import front from "./images/Slime.jpg";

interface CardProp {
  card: "back" | "front";
}

const miniCardStyle: React.CSSProperties = {
  height: "110px",
  width: "79px",
};

export class ITCGCard extends React.Component<CardProp> {
  render() {
    const propCard = this.props.card;
    const source = propCard === "front" ? front : back;
    return (
      <div>
        <img style={miniCardStyle} src={source} alt="card" />
      </div>
    );
  }
}
