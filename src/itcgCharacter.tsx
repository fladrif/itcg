import React from 'react';

import { PlayerState } from './game';
import { Location } from './actions';

import { ITCGCard } from './itcgCard';

export interface CharacterProp {
  playerState: PlayerState;
  move: () => any;
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  alignItems: 'center',
  width: '100%',
  height: '100%',
};

export class ITCGCharacter extends React.Component<CharacterProp> {
  render() {
    const skillCards = this.props.playerState.learnedSkills.map((card, index) => (
      <ITCGCard
        style={'leveledCardStyle'}
        location={Location.CharAction}
        card={card}
        move={this.props.move}
        skillPos={index + 3}
      />
    ));

    return (
      <div style={baseStyle}>
        <ITCGCard
          style={'characterStyle'}
          location={Location.CharAction}
          card={this.props.playerState.character}
          move={this.props.move}
        />
        {skillCards}
      </div>
    );
  }
}
