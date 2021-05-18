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
  playerID: PlayerID;
  opponentID: PlayerID;
  playerState: Dictionary<PlayerState>;

  constructor(props: BoardProps<GameState>) {
    super(props);

    this.playerID = props.playerID!;
    this.opponentID = Object.keys(props.G.player).filter(
      (id) => id != this.playerID
    )[0];
    this.playerState = props.G.player;
  }

  render() {
    const opponentLine = new Array(
      this.playerState[this.opponentID].hand.length
    );
    opponentLine.fill(<ITCGCard card="back" />);
    const player = this.playerState[this.playerID];

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
          <button onClick={() => this.props.moves.drawCard()}>Deck</button>
        </div>
      </div>
    );
  }
}
