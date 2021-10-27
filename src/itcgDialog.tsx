import React from 'react';

import { Location } from './actions';
import { BLANK_CARDNAME, NonCharacter } from './card';
import { PlayerState } from './game';
import { State as BoardState } from './itcgBoard';
import { ITCGCard, ITCGCardback } from './itcgCard';

export type DialogBoxOpts = 'discard' | 'deck' | 'oppdiscard' | 'oppdeck';

interface DialogProp {
  playerState: PlayerState;
  opponentState: PlayerState;
  currentPlayer: boolean;
  stage: string;
  select: () => any;
  updateBoard: (state: BoardState) => any;
  dialogBox?: DialogBoxOpts;
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '50vw',
  height: '33vh',
  borderRadius: '1em',
  border: 'dashed',
  textAlign: 'center',
  textShadow:
    '2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
  backgroundColor: 'rgba(84, 84, 84, 0.5)',
  fontSize: '42px',
  overflow: 'hidden',
};

const titleStyle: React.CSSProperties = {
  padding: '2%',
};

const selectionStyle: React.CSSProperties = {
  display: 'flex',
  flex: '1',
  flexDirection: 'row',
  overflow: 'auto',
};

const buttonStyle: React.CSSProperties = {
  alignSelf: 'center',
  width: '20%',
  fontSize: '50%',
  borderRadius: '0.5em',
};

export class ITCGDialog extends React.Component<DialogProp> {
  getMessage() {
    if (this.props.dialogBox === 'discard') return 'Discard Pile';
    if (this.props.dialogBox === 'oppdiscard') return "Opponent's Discard Pile";
    if (this.props.dialogBox === 'deck') return 'Deck';
    if (this.props.dialogBox === 'oppdeck') return "Opponent's Deck";
  }

  getDisplayPile(): NonCharacter[] {
    if (this.props.dialogBox === 'discard') return this.props.playerState.discard;
    if (this.props.dialogBox === 'oppdiscard') return this.props.opponentState.discard;
    if (this.props.dialogBox === 'deck') return this.props.playerState.deck;
    if (this.props.dialogBox === 'oppdeck') return this.props.opponentState.deck;
  }

  getLocation(): Location {
    if (this.props.dialogBox === 'discard' || this.props.dialogBox === 'oppdiscard') {
      return this.props.currentPlayer ? Location.Discard : Location.OppDiscard;
    }
    if (this.props.dialogBox === 'deck' || this.props.dialogBox === 'oppdeck') {
      return this.props.currentPlayer ? Location.Deck : Location.OppDeck;
    }
  }

  finish() {
    this.props.updateBoard({ dialogBox: undefined });
  }

  render() {
    if (this.props.dialogBox === undefined) return null;

    const message = this.getMessage();

    const pile = this.getDisplayPile();

    const deck = pile.map((card) => {
      if (card.name !== BLANK_CARDNAME) {
        return (
          <ITCGCard
            move={this.props.select}
            location={this.getLocation()}
            card={card}
            key={card.key}
          />
        );
      } else {
        return <ITCGCardback key={card.key} />;
      }
    });

    return (
      <div style={baseStyle}>
        <div style={titleStyle}>{message}</div>
        <div style={selectionStyle}>{deck}</div>
        <button style={buttonStyle} onClick={() => this.finish()}>
          Done
        </button>
      </div>
    );
  }
}
