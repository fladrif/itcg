import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Styles, ITCGCard } from './itcgCard';
import { isMonster, Monster, Character, NonCharacter } from './card';
import { GameState, PlayerState } from './game';
import { getMonsterAtt, getMonsterHealth } from './state';
import { Location } from './target';
import { deepCardComp } from './utils';
import { Ctx } from 'boardgame.io';

interface FieldProps {
  G: GameState;
  ctx: Ctx;
  state: PlayerState;
  location: Location;
  stage: string;
  select: () => any;
  attack: () => any;
  source?: Character | NonCharacter;
}

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flex: '1',
  alignItems: 'center',
  maxHeight: '50%',
  overflow: 'auto',
};

const activeStyle: React.CSSProperties = {
  ...fieldStyle,
  backgroundColor: '#c9def2aa',
};

const inactiveStyle: React.CSSProperties = {
  ...fieldStyle,
  backgroundColor: '#a0b1c150',
};

export class ITCGField extends React.Component<FieldProps> {
  updateMonsterState(card: NonCharacter): NonCharacter | Monster {
    if (!isMonster(card)) return card;

    return {
      ...card,
      attack: getMonsterAtt(this.props.G, this.props.ctx, card),
      health: getMonsterHealth(this.props.G, this.props.ctx, card),
    };
  }

  render() {
    const field = this.props.state.field.map((card) => {
      const styles: Styles[] = [];
      const skill: Styles[] = [];

      const isAttack = isMonster(card) && this.props.stage === 'attack';
      const move = isAttack ? this.props.attack : this.props.select;

      if (card.selected) {
        styles.push('selectedBorderTop');
        skill.push('selectedBorderBot');
      } else if (isAttack && (card as Monster).attacks <= 0) {
        styles.push('shadeStyle');
        skill.push('shadeStyle');
      } else if (this.props.source && deepCardComp(card, this.props.source)) {
        styles.push('activatedBorderTop');
        skill.push('activatedBorderBot');
      }

      return (
        <div
          data-tooltip-id="expanded-card"
          data-tooltip-html={renderToStaticMarkup(
            <ITCGCard
              move={() => {}}
              location={this.props.location}
              styles={['expandStyle']}
              skill0={['expandStyle']}
              card={card}
              key={card.key}
            />
          )}
        >
          <ITCGCard
            styles={styles}
            skill0={skill}
            move={move}
            location={this.props.location}
            card={this.updateMonsterState(card)}
            key={card.key}
          />
        </div>
      );
    });
    const stage = this.props.stage;
    const parsedStyle = stage && stage !== 'unactive' ? activeStyle : inactiveStyle;
    return <div style={parsedStyle}>{field}</div>;
  }
}
