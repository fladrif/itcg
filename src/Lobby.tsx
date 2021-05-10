import React from "react";
import { Lobby } from "boardgame.io/react";

import { ITCG } from "./game";
import { ITCGBoard } from "./board";

class App extends React.Component {
  render() {
    return (
      <Lobby
        gameServer={"http://localhost:8000"}
        lobbyServer={"http://localhost:8000"}
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
