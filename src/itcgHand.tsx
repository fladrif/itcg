import { Ctx } from 'boardgame.io';
import React, { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as lodash from 'lodash';

import { Styles, ITCGCard, ITCGCardback } from './itcgCard';
import { GameState, PlayerState } from './game';
import { Location } from './target';
import { nullMove } from './moves';
import { BLANK_CARDNAME } from './card';
import { Decision, isSelectable } from './stack';

interface HandProp {
  G: GameState;
  ctx: Ctx;
  playerState: PlayerState;
  curDecision?: Decision;
  currentPlayer?: boolean;
  stage?: string;
  select?: () => any;
  level?: () => any;
}

export class ITCGHand extends React.Component<HandProp> {
  render() {
    if (!this.props.select || !this.props.level) {
      const opponentLine: ReactElement[] = [];
      const playerHand = lodash.sortBy(
        this.props.playerState.hand,
        (card) => card.name !== BLANK_CARDNAME
      );

      for (let i = 0; i < playerHand.length; i++) {
        const card = playerHand[i];

        if (card.name !== BLANK_CARDNAME) {
          opponentLine.push(
            <div
              data-tooltip-id="expanded-card"
              data-tooltip-html={renderToStaticMarkup(
                <ITCGCard
                  move={nullMove}
                  location={Location.OppHand}
                  styles={['expandStyle']}
                  skill0={['expandStyle']}
                  card={card}
                  key={card.key}
                />
              )}
            >
              <ITCGCard
                move={nullMove}
                location={Location.OppHand}
                card={card}
                key={card.key}
              />
            </div>
          );
        } else {
          opponentLine.push(<ITCGCardback key={card.key} />);
        }
      }
      return opponentLine;
    }

    const playerLine: ReactElement[] = [];

    for (const card of this.props.playerState.hand) {
      const styles: Styles[] = [];
      const skill: Styles[] = [];

      if (card.selected) {
        styles.push('selectedBorderTop');
        skill.push('selectedBorderBot');
      } else if (
        this.props.curDecision &&
        isSelectable(
          this.props.G,
          this.props.ctx,
          this.props.playerState,
          this.props.curDecision,
          card
        )
      ) {
        styles.push('selectableBorderTop');
        skill.push('selectableBorderBot');
      }

      playerLine.push(
        <div
          data-tooltip-id="expanded-card"
          data-tooltip-html={renderToStaticMarkup(
            <ITCGCard
              move={() => {}}
              location={this.props.currentPlayer ? Location.Hand : Location.OppHand}
              styles={['expandStyle']}
              skill0={['expandStyle']}
              card={card}
              key={card.key}
            />
          )}
        >
          <ITCGCard
            move={this.props.stage === 'select' ? this.props.select! : this.props.level!}
            styles={styles}
            skill0={skill}
            location={this.props.currentPlayer ? Location.Hand : Location.OppHand}
            card={card}
            key={card.key}
          />
        </div>
      );
    }

    return playerLine;
  }
}
