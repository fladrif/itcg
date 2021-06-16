import React from "react";
import { BoardProps } from "boardgame.io/react";

import { GameState } from "./game";
import { getOpponentID } from "./utils";
import { Location } from "./actions";

import { ITCGCard, ITCGCardback } from "./itcgCard";
import { ITCGStats } from "./itcgStats";
import { ITCGCharacter } from "./itcgCharacter";

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
  backgroundColor: "#2f2f2f",
  gridArea: "stat",
};

const charStyle: React.CSSProperties = {
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
  backgroundColor: "#2f2f2f",
  gridArea: "ostat",
};

const oppDeckStyle: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#ffd700",
  gridArea: "od",
};

const oppCharStyle: React.CSSProperties = {
  backgroundColor: "#40e0d0",
  gridArea: "ochar",
};

export class ITCGBoard extends React.Component<BoardProps<GameState>> {
  render() {
    const playerID = this.props.playerID!;
    const opponentID = getOpponentID(this.props.G, this.props.ctx, playerID);
    const playerState = this.props.G.player[playerID];
    const opponentState = this.props.G.player[opponentID];

    const currentPlayerStage = this.props.ctx.activePlayers
      ? this.props.ctx.activePlayers[playerID]
      : "";

    const opponentLine = new Array(opponentState.hand.length);

    opponentLine.fill(<ITCGCardback />);
    const player = playerState;

    const playerLine = [];
    for (const card of player.hand) {
      if (
        !!this.props.ctx.activePlayers &&
        this.props.ctx.activePlayers[playerID] === "select"
      ) {
        playerLine.push(
          <ITCGCard
            move={this.props.moves.selectTarget}
            location={Location.Hand}
            card={card}
          />
        );
      } else {
        playerLine.push(
          <ITCGCard
            move={this.props.moves.levelUp}
            location={Location.Hand}
            card={card}
          />
        );
      }
    }

    const button =
      currentPlayerStage == "level" ? (
        <div>
          <button onClick={() => this.props.moves.noLevel()}>Skip Level Stage</button>
        </div>
      ) : currentPlayerStage == "activate" ? (
        <div>
          <button onClick={() => this.props.moves.noActivate()}>
            Go to Attack Stage
          </button>
        </div>
      ) : currentPlayerStage == "select" ? (
        <div>
          <button onClick={() => this.props.moves.confirmSkill()}>Confirm</button>
          <button onClick={() => this.props.moves.declineSkill()}>Decline</button>
        </div>
      ) : (
        <div>
          <button onClick={() => this.props.moves.noAttacks()}>Pass Turn</button>
        </div>
      );

    return (
      <div style={containerStyle}>
        <div style={oppDeckStyle}>
          <ITCGCardback />
        </div>
        <div style={oppHandStyle}>{opponentLine}</div>
        <div style={oppCharStyle}>
          <ITCGCharacter
            playerState={opponentState}
            move={this.props.moves.activateSkill}
          />
        </div>
        <div style={oppStatStyle}>
          <ITCGStats
            playerState={opponentState}
            stage={
              this.props.ctx.activePlayers ? this.props.ctx.activePlayers[opponentID] : ""
            }
          />
        </div>
        <div style={mapStyle}>
          <div>
            {opponentState.board.map((card) => (
              <ITCGCard
                move={this.props.moves.selectTarget}
                location={Location.OppBoard}
                card={card}
              />
            ))}
          </div>
          <div>
            {playerState.board.map((card) => (
              <ITCGCard
                move={this.props.moves.selectTarget}
                location={Location.Board}
                card={card}
              />
            ))}
          </div>
        </div>
        <div style={statStyle}>
          <ITCGStats
            playerState={playerState}
            confMove={this.props.moves.confirmSkill}
            declMove={this.props.moves.declineSkill}
            stage={
              this.props.ctx.activePlayers ? this.props.ctx.activePlayers[playerID] : ""
            }
          />
        </div>
        <div style={charStyle}>
          <ITCGCharacter
            playerState={playerState}
            move={this.props.moves.activateSkill}
          />
        </div>
        <div style={handStyle}>{playerLine}</div>
        <div style={deckStyle}>{button}</div>
      </div>
    );
  }
}
