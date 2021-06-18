import React from 'react';

import { PlayerState } from './game';
import { Location } from './actions';

import { ITCGCard } from './itcgCard';

export interface CharacterProp {
  playerState: PlayerState;
  currentPlayer: boolean;
  stage: string;
  activate: () => any;
  select: () => any;
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
    const move = this.props.stage == 'activate' ? this.props.activate : this.props.select;

    const skillCards = this.props.playerState.learnedSkills.map((card, index) => (
      <ITCGCard
        style={'leveledCardStyle'}
        location={Location.CharAction}
        card={card}
        move={move}
        skillPos={index + 3}
      />
    ));

    return (
      <div style={baseStyle}>
        <ITCGCard
          style={'characterStyle'}
          location={this.props.currentPlayer ? Location.Character : Location.OppCharacter}
          card={this.props.playerState.character}
          move={move}
        />
        {skillCards}
      </div>
    );
  }
}
