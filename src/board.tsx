import React from "react";
import { BoardProps } from "boardgame.io/react";
import { PlayerID } from "boardgame.io";

import { GameState, PlayerState } from "./game";

import { ITCGCard } from "./card";

const containerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "20% 50% 30%",
  gridTemplateRows: "20% 60% 20%",
  height: "100vh",
  gridTemplateAreas: "'h h .' '. b b' 'f f d'",
  backgroundColor: "#A3FFB4",
};

const podStyle1: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#36896e",
  gridArea: "h",
};

const podStyle2: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#c9def2",
  gridArea: "b",
};

const podStyle3: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#b4f9e6",
  gridArea: "f",
};

const podStyle4: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#ffd700",
  gridArea: "d",
};

export class ITCGBoard extends React.Component<BoardProps<GameState>> {
  render() {
    const playerID = this.props.playerID!;
    const opponentID = Object.keys(this.props.G.player).filter(
      (id) => id != playerID
    )[0];
    const playerState = this.props.G.player;

    const opponentLine = new Array(playerState[opponentID].hand.length);

    opponentLine.fill(<ITCGCard card="back" />);
    const player = playerState[playerID];

    const playerLine = [];
    for (const card of player.hand) {
      playerLine.push(<ITCGCard card={card.card} />);
    }

    return (
      <div style={containerStyle}>
        <div style={podStyle1}>{opponentLine}</div>
        <div style={podStyle2}></div>
        <div style={podStyle3}>{playerLine}</div>
        <div style={podStyle4}>
          <button onClick={() => this.props.moves.drawCard()}>Draw Card</button>
        </div>
      </div>
    );
  }
}
