import React from 'react';
import { Lobby } from 'boardgame.io/react';

import { ITCG } from './game';
import { ITCGBoard } from './itcgBoard';

class App extends React.Component {
  render() {
    return (
      <Lobby
        gameServer={'https://server.maple.rs'}
        lobbyServer={'https://server.maple.rs'}
        gameComponents={[
          {
            game: ITCG,
            board: ITCGBoard,
          },
        ]}
      />
    );
  }
}

export default App;
