import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { ITCG } from "./game";
import { ITCGBoard } from "./itcgBoard";

const App = Client({
  game: ITCG,
  board: ITCGBoard,
  multiplayer: Local(),
  debug: false,
});

export default App;
