import React from 'react';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';

import { ITCG } from './game';
import { ITCGBoard } from './itcgBoard';

class App extends React.Component {
  render() {
    const GameClient = Client({
      game: ITCG,
      board: ITCGBoard,
      multiplayer: Local(),
      debug: false,
    });

    return (
      <>
        <GameClient playerID="0" />
        <GameClient playerID="1" />
      </>
    );
  }
}

export default App;
