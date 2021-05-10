import { Client } from "boardgame.io/react";
import { ITCG } from "./game";
import { ITCGBoard } from "./board";

const App = Client({ game: ITCG, board: ITCGBoard });

export default App;
