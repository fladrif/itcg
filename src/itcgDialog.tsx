import React from 'react';

import { Location } from './actions';
import { PlayerState } from './game';
import { ITCGCard } from './itcgCard';

interface DialogProp {
  playerState: PlayerState;
  stage: string;
  select: () => any;
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

export class ITCGDialog extends React.Component<DialogProp> {
  render() {
    if (this.props.stage !== 'select') return null;

    const message = 'Choose a card';

    const deck = this.props.playerState.deck.map((card) => {
      return (
        <ITCGCard
          move={this.props.select}
          location={Location.Deck}
          card={card}
          key={card.key}
        />
      );
    });

    return (
      <div style={baseStyle}>
        <div style={titleStyle}>{message}</div>
        <div style={selectionStyle}>{deck}</div>
      </div>
    );
  }
}
