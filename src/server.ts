import { Server } from "boardgame.io/server";
import { ITCG } from "./game";

const server = Server({
  games: [ITCG],
});

server.run(18000);
