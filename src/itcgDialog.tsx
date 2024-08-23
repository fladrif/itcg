import React from 'react';

import { Location } from './target';
import { BLANK_CARDNAME, NonCharacter } from './card';
import { PlayerState } from './game';
import { State as BoardState } from './itcgBoard';
import { Styles, ITCGCard, ITCGCardback } from './itcgCard';

export type DialogBoxOpts =
  | 'discard'
  | 'deck'
  | 'oppdiscard'
  | 'oppdeck'
  | 'temp'
  | 'opptemp';

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
  width: '70vw',
  height: '60vh',
  borderRadius: '1em',
  border: 'dashed',
  textAlign: 'center',
  textShadow:
    '2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
  backgroundColor: 'rgba(84, 84, 84, 0.5)',
  fontSize: '2vw',
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
  fontSize: '1vw',
  borderRadius: '0.5em',
};

export class ITCGDialog extends React.Component<DialogProp> {
  getMessage() {
    if (this.props.dialogBox === 'discard') return 'Discard Pile';
    if (this.props.dialogBox === 'oppdiscard') return "Opponent's Discard Pile";
    if (this.props.dialogBox === 'deck') return 'Deck';
    if (this.props.dialogBox === 'oppdeck') return "Opponent's Deck";
    if (this.props.dialogBox === 'temp') return 'Temporary Zone';
    if (this.props.dialogBox === 'opptemp') return 'Temporary Zone';
  }

  getDisplayPile(): NonCharacter[] {
    if (this.props.dialogBox === 'discard') return this.props.playerState.discard;
    if (this.props.dialogBox === 'oppdiscard') return this.props.opponentState.discard;
    if (this.props.dialogBox === 'deck') return this.props.playerState.deck;
    if (this.props.dialogBox === 'oppdeck') return this.props.opponentState.deck;
    if (this.props.dialogBox === 'temp') return this.props.playerState.temporary;
    if (this.props.dialogBox === 'opptemp') return this.props.opponentState.temporary;
  }

  getLocation(): Location {
    if (this.props.dialogBox === 'discard' || this.props.dialogBox === 'oppdiscard') {
      return this.props.currentPlayer ? Location.Discard : Location.OppDiscard;
    }
    if (this.props.dialogBox === 'deck' || this.props.dialogBox === 'oppdeck') {
      return this.props.currentPlayer ? Location.Deck : Location.OppDeck;
    }
    if (this.props.dialogBox === 'temp' || this.props.dialogBox === 'opptemp') {
      return this.props.currentPlayer ? Location.Temporary : Location.OppTemporary;
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
      const styles: Styles[] = [];
      const skill: Styles[] = [];

      if (card.selected) {
        styles.push('selectedBorderTop');
        skill.push('selectedBorderBot');
      } else {
        styles.push('expandStyle');
        skill.push('expandStyle');
      }

      if (card.name !== BLANK_CARDNAME) {
        return (
          <ITCGCard
            move={this.props.select}
            styles={styles}
            skill0={skill}
            location={this.getLocation()}
            card={card}
            key={card.key}
          />
        );
      } else {
        return <ITCGCardback key={card.key} styles={['expandStyle']} />;
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
