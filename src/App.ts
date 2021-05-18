import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { ITCG } from "./game";
import { ITCGBoard } from "./board";

const App = Client({
  game: ITCG,
  board: ITCGBoard,
  multiplayer: Local(),
});

export default App;
