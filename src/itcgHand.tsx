import React from 'react';
import * as lodash from 'lodash';

import { Styles, ITCGCard, ITCGCardback } from './itcgCard';
import { PlayerState } from './game';
import { Location } from './target';
import { nullMove } from './moves';
import { BLANK_CARDNAME } from './card';

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
      const playerHand = lodash.sortBy(
        this.props.playerState.hand,
        (card) => card.name !== BLANK_CARDNAME
      );

      for (let i = 0; i < playerHand.length; i++) {
        const card = playerHand[i];

        if (card.name !== BLANK_CARDNAME) {
          opponentLine.push(
            <ITCGCard
              move={nullMove}
              location={Location.OppHand}
              card={card}
              key={card.key}
            />
          );
        } else {
          opponentLine.push(<ITCGCardback key={card.key} />);
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
