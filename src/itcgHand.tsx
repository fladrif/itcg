import React from 'react';
import { v4 } from 'uuid';

import { Styles, ITCGCard, ITCGCardback } from './itcgCard';
import { PlayerState } from './game';
import { Location } from './actions';
import { nullMove } from './moves';

interface HandProp {
  playerState: PlayerState;
  currentPlayer?: boolean;
  stage?: string;
  select?: () => any;
  level?: () => any;
}

export class ITCGHand extends React.Component<HandProp> {
  render() {
    if (!this.props.select || !this.props.level) {
      const opponentLine = [];
      for (let i = 0; i < this.props.playerState.hand.length; i++) {
        const card = this.props.playerState.hand[i];

        if (card.reveal) {
          opponentLine.push(
            <ITCGCard
              move={nullMove}
              location={Location.OppHand}
              card={card}
              key={card.key}
            />
          );
        } else {
          opponentLine.push(<ITCGCardback key={v4()} />);
        }
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
          location={this.props.currentPlayer ? Location.Hand : Location.OppHand}
          card={card}
          key={card.key}
        />
      );
    }

    return playerLine;
  }
}
