import React from 'react';
import { PlayerID } from 'boardgame.io';
import { BoardProps } from 'boardgame.io/react';

import { GameState } from './game';

export class ITCGBoard extends React.Component<BoardProps<GameState>> {
  onClick(id: PlayerID) {
    this.props.moves.drawCard(id);
  }

  render() {
    const cellStyle: React.CSSProperties = {
      border: '1px solid #555',
      width: '50px',
      height: '50px',
      lineHeight: '50px',
      textAlign: 'center',
    };

    let tbody = [];
    const playerIDs= Object.keys(this.props.G.player) as (keyof GameState["player"])[];
    for (const playerID of playerIDs) {
      let cells = [];
      cells.push(<button onClick={() => this.props.moves.drawCard(playerID)}>Deck</button>);
      const player = this.props.G.player[ playerID ];
      if (!player) continue;
      for (const card of player.hand) {
        cells.push(
          <td style={cellStyle} key={card.id}>
            {card.id}
          </td>
        );
      }
      tbody.push(<tr>{cells}</tr>);
    }

    return (
      <div>
        <table id="board">
          <tbody>{tbody}</tbody>
        </table>
      </div>
    );
  }
}
