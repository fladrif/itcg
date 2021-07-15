import React from 'react';

import { Styles, ITCGCard } from './itcgCard';
import { PlayerState } from './game';
import { Location } from './actions';

interface DiscardProp {
  playerState: PlayerState;
  currentPlayer: boolean;
  select: () => any;
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  alignItems: 'center',
  width: '50%',
};

export class ITCGDiscard extends React.Component<DiscardProp> {
  render() {
    const playerLine = [];

    for (const card of this.props.playerState.discard) {
      const styles: Styles[] = [];
      const skill: Styles[] = [];

      if (card.selected) {
        styles.push('selectedBorderTop');
        skill.push('selectedBorderBot');
      }

      playerLine.push(
        <ITCGCard
          move={this.props.select}
          styles={styles}
          skill0={skill}
          location={this.props.currentPlayer ? Location.Discard : Location.OppDiscard}
          card={card}
          key={card.key}
        />
      );
    }

    return <div style={baseStyle}>{playerLine}</div>;
  }
}
