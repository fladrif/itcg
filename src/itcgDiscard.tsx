import React from 'react';

import { State as BoardState } from './itcgBoard';
import { ITCGCard } from './itcgCard';
import { PlayerState } from './game';
import { Location } from './target';
import { NonCharacter } from './card';

interface DiscardProp {
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
  textShadow:
    '1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
};

export class ITCGDiscard extends React.Component<DiscardProp> {
  formatCard(card: NonCharacter) {
    return (
      <ITCGCard
        move={this.props.select}
        location={this.props.currentPlayer ? Location.Discard : Location.OppDiscard}
        card={card}
        key={card.key}
        expandable={false}
      />
    );
  }

  updateBoard() {
    const newBoardState: BoardState = {
      dialogBox: this.props.mainPlayer ? 'discard' : 'oppdiscard',
    };

    this.props.updateBoard(newBoardState);
  }

  render() {
    const discardLength = this.props.playerState.discard.length;
    const topCard =
      discardLength > 0 ? this.props.playerState.discard[discardLength - 1] : undefined;
    const formattedCard = topCard ? this.formatCard(topCard) : <></>;

    return (
      <div style={baseStyle} onClick={() => this.updateBoard()}>
        Discard{formattedCard}
      </div>
    );
  }
}
