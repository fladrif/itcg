import React from "react";
import { PlayerID } from "boardgame.io";
import { BoardProps } from "boardgame.io/react";

import { GameState } from "./game";

export class ITCGBoard extends React.Component<BoardProps<GameState>> {
  onClick(id: PlayerID) {
    this.props.moves.drawCard(id);
  }

  render() {
    const cellStyle: React.CSSProperties = {
      border: "1px solid #555",
      width: "50px",
      height: "50px",
      lineHeight: "50px",
      textAlign: "center",
    };

    const playerID = this.props.playerID!;
    const opponentID = Object.keys(this.props.G.player).filter(
      (id) => id != playerID
    )[0];

    let opponentLine = new Array(this.props.G.player[opponentID].hand.length);
    opponentLine.fill(
      <td style={cellStyle} key="card">
        itcg
      </td>
    );
    opponentLine = [<td></td>, ...opponentLine];

    let playerLine = [];
    playerLine.push(
      <button onClick={() => this.props.moves.drawCard(playerID)}>Deck</button>
    );
    const player = this.props.G.player[playerID];

    for (const card of player.hand) {
      playerLine.push(
        <td style={cellStyle} key={card.id}>
          {card.id}
        </td>
      );
    }
    let tbody = [];
    tbody.push(<tr>{opponentLine}</tr>);
    tbody.push(<tr>{playerLine}</tr>);

    return (
      <div>
        <table id="board">
          <tbody>{tbody}</tbody>
        </table>
      </div>
    );
  }
}
