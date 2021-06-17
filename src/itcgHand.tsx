import React from 'react';

import { ITCGCard, ITCGCardback } from './itcgCard';
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
      const opponentLine = new Array(this.props.playerState.hand.length);
      return opponentLine.fill(<ITCGCardback />);
    }

    const playerLine = [];

    for (const card of this.props.playerState.hand) {
      if (this.props.stage === 'select') {
        playerLine.push(
          <ITCGCard move={this.props.select} location={Location.Hand} card={card} />
        );
      } else {
        playerLine.push(
          <ITCGCard move={this.props.level} location={Location.Hand} card={card} />
        );
      }
    }

    return playerLine;
  }
}
