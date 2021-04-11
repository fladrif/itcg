import { Ctx, PlayerID } from 'boardgame.io';

export interface Card {
}

export interface PlayerState {
    deck: Card[];
    hand: Card[];
}

export interface GameState {
    player: {
        "0": PlayerState,
        "1": PlayerState,
    }
}

function drawCard(G: GameState, _ctx: Ctx, id: PlayerID): GameState {
    return G.player[id].hand.push(G.player[id].deck.pop());
};

export const ITCG = {
    setup: () => ({cells: Array(9).fill(null)}),

    moves: {
        drawCard,
    }
};
