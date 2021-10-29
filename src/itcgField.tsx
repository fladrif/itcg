import React from 'react';

import { Styles, ITCGCard } from './itcgCard';
import { PlayerState } from './game';
import { Location } from './actions';
import { isMonster, Monster, Character, NonCharacter } from './card';
import { deepCardComp } from './utils';

interface FieldProps {
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
};

const activeStyle: React.CSSProperties = {
  ...fieldStyle,
  backgroundColor: '#c9def2',
};

const inactiveStyle: React.CSSProperties = {
  ...fieldStyle,
  backgroundColor: '#a0b1c1',
};

export class ITCGField extends React.Component<FieldProps> {
  render() {
    const field = this.props.state.field.map((card) => {
      const styles: Styles[] = [];
      const skill: Styles[] = [];

      const isAttack = isMonster(card) && this.props.stage == 'attack';
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
        <ITCGCard
          styles={styles}
          skill0={skill}
          move={move}
          location={this.props.location}
          card={card}
          key={card.key}
        />
      );
    });
    const stage = this.props.stage;
    const parsedStyle = stage && stage !== '' ? activeStyle : inactiveStyle;
    return <div style={parsedStyle}>{field}</div>;
  }
}
