import React from 'react';

import { ITCGCard } from './itcgCard';
import { PlayerState } from './game';
import { Location } from './actions';

interface FieldProps {
  state: PlayerState;
  select: () => any;
  location: Location;
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
      <ITCGCard move={this.props.select} location={this.props.location} card={card} />
    ));
    return <div style={fieldStyle}>{field} </div>;
  }
}
