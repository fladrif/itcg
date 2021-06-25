import React from 'react';
import { v4 } from 'uuid';

import { Styles, ITCGCard, ITCGCardback } from './itcgCard';
import { PlayerState } from './game';
import { Location } from './actions';

interface HandProp {
  playerState: PlayerState;
  stage?: string;
  select?: () => any;
  level?: () => any;
}

export class ITCGHand extends React.Component<HandProp> {
  render() {
    if (!this.props.select || !this.props.level) {
      const opponentLine = [];
      for (let i = 0; i < this.props.playerState.hand.length; i++) {
        opponentLine.push(<ITCGCardback key={v4()} />);
      }
      return opponentLine;
    }

    const playerLine = [];

    for (const card of this.props.playerState.hand) {
      const styles: Styles[] = [];
      const skill: Styles[] = [];

      if (card.selected) {
        styles.push('selectedBorderTop');
        skill.push('selectedBorderBot');
      }

      playerLine.push(
        <ITCGCard
          move={this.props.stage === 'select' ? this.props.select! : this.props.level!}
          styles={styles}
          skill0={skill}
          location={Location.Hand}
          card={card}
          key={card.key}
        />
      );
    }

    return playerLine;
  }
}
