import React from "react";
import { PlayerState } from "./game";

import { ITCGCard } from "./itcgCard";

export interface CharacterProp {
  playerState: PlayerState;
}

const baseStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: "1",
  overflow: "auto",
  alignItems: "center",
  width: "100%",
  height: "100%",
};

export class ITCGCharacter extends React.Component<CharacterProp> {
  render() {
    const skillCards = this.props.playerState.learnedSkills.map((card) => (
      <ITCGCard style={"leveledCardStyle"} card={card} />
    ));
    return (
      <div style={baseStyle}>
        <ITCGCard
          style={"characterStyle"}
          card={this.props.playerState.deck.character}
        />
        {skillCards}
      </div>
    );
  }
}
