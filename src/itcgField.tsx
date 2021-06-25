import React from 'react';

import { ITCGCard } from './itcgCard';
import { PlayerState } from './game';
import { Location } from './actions';
import { isMonster } from './card';

interface FieldProps {
  state: PlayerState;
  location: Location;
  stage: string;
  select: () => any;
  attack: () => any;
}

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flex: '1',
  flexDirection: 'row',
  alignItems: 'center',
};

export class ITCGField extends React.Component<FieldProps> {
  render() {
    const field = this.props.state.field.map((card) => (
      <ITCGCard
        move={
          isMonster(card) && this.props.stage == 'attack'
            ? this.props.attack
            : this.props.select
        }
        location={this.props.location}
        card={card}
        key={card.key}
      />
    ));
    return <div style={fieldStyle}>{field} </div>;
  }
}
