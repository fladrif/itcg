import React from "react";
import { BoardProps } from "boardgame.io/react";

import { GameState } from "./game";

import { ITCGCard } from "./itcgCard";
import { cardback } from "./card";

const containerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "15% 70% 15%",
  gridTemplateRows: "20% 5% 50% 5% 20%",
  height: "100vh",
  gridTemplateAreas: "'. oh oh' '. ostat .' '. m .' '. stat .' 'h h d'",
  backgroundColor: "#A3FFB4",
};

const handStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#36896e",
  gridArea: "h",
};

const oppHandStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#36896e",
  gridArea: "oh",
};

const mapStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#c9def2",
  gridArea: "m",
};

const deckStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#ffd700",
  gridArea: "d",
};

const statStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#ff0000",
  gridArea: "stat",
};

const oppStatStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#ff0000",
  gridArea: "ostat",
};

export class ITCGBoard extends React.Component<BoardProps<GameState>> {
  render() {
    const playerID = this.props.playerID!;
    const opponentID = Object.keys(this.props.G.player).filter(
      (id) => id != playerID
    )[0];
    const playerState = this.props.G.player;

    const opponentLine = new Array(playerState[opponentID].hand.length);

    opponentLine.fill(<ITCGCard card={cardback} />);
    const player = playerState[playerID];

    const playerLine = [];
    for (const card of player.hand) {
      playerLine.push(<ITCGCard card={card} />);
    }

    return (
      <div style={containerStyle}>
        <div style={oppHandStyle}>{opponentLine}</div>
        <div style={oppStatStyle}></div>
        <div style={mapStyle}></div>
        <div style={statStyle}></div>
        <div style={handStyle}>{playerLine}</div>
        <div style={deckStyle}>
          <button onClick={() => this.props.moves.drawCard()}>Draw Card</button>
        </div>
      </div>
    );
  }
}
