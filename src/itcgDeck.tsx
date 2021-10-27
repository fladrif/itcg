import React from 'react';

import { State as BoardState } from './itcgBoard';
import { Styles, ITCGCard } from './itcgCard';
import { PlayerState } from './game';
import { Location } from './actions';
import { NonCharacter } from './card';

interface DeckProp {
  playerState: PlayerState;
  currentPlayer: boolean;
  select: () => any;
  updateBoard: (state: BoardState) => any;
  mainPlayer: boolean;
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  alignItems: 'center',
  width: '50%',
};

export class ITCGDeck extends React.Component<DeckProp> {
  formatCard(card: NonCharacter) {
    return (
      <ITCGCard
        move={this.props.select}
        location={this.props.currentPlayer ? Location.Deck : Location.OppDeck}
        card={card}
        key={card.key}
      />
    );
  }

  updateBoard() {
    const newBoardState: BoardState = {
      dialogBox: this.props.mainPlayer ? 'deck' : 'oppdeck',
    };

    this.props.updateBoard(newBoardState);
  }

  render() {
    const deckLength = this.props.playerState.deck.length;
    const topCard = deckLength > 0 ? this.props.playerState.deck[0] : undefined;
    const formattedCard = topCard ? this.formatCard(topCard) : <></>;

    return (
      <div style={baseStyle} onClick={() => this.updateBoard()}>
        Deck{formattedCard}
      </div>
    );
  }
}
