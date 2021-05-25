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
  gridTemplateAreas:
    "'od oh oh' 'ochar ostat char' 'ochar m char' 'ochar stat char' 'h h d'",
  backgroundColor: "#A3FFB4",
};

const handStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#36896e",
  gridArea: "h",
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

const charStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#40e0d0",
  gridArea: "char",
};

const oppHandStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#36896e",
  gridArea: "oh",
};

const oppStatStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#ff0000",
  gridArea: "ostat",
};

const oppDeckStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#ffd700",
  gridArea: "od",
};

const oppCharStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#40e0d0",
  gridArea: "ochar",
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

    const character = <ITCGCard card={playerState[playerID].deck.character} />;
    const oppCharacter = (
      <ITCGCard card={playerState[opponentID].deck.character} />
    );

    return (
      <div style={containerStyle}>
        <div style={oppDeckStyle}>
          <ITCGCard card={cardback} />
        </div>
        <div style={oppHandStyle}>{opponentLine}</div>
        <div style={oppCharStyle}>{oppCharacter}</div>
        <div style={oppStatStyle}></div>
        <div style={mapStyle}></div>
        <div style={statStyle}></div>
        <div style={charStyle}>{character}</div>
        <div style={handStyle}>{playerLine}</div>
        <div style={deckStyle}>
          <button onClick={() => this.props.moves.drawCard()}>
            <ITCGCard card={cardback} />
          </button>
        </div>
      </div>
    );
  }
}
