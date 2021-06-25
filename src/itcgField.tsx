import React from 'react';

import { Styles, ITCGCard } from './itcgCard';
import { PlayerState } from './game';
import { Location } from './actions';
import { isMonster, Monster } from './card';
import { deepCardComp } from './utils';

interface FieldProps {
  state: PlayerState;
  location: Location;
  stage: string;
  select: () => any;
  attack: () => any;
  attacker?: Monster;
}

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flex: '1',
  flexDirection: 'row',
  alignItems: 'center',
};

export class ITCGField extends React.Component<FieldProps> {
  render() {
    const field = this.props.state.field.map((card) => {
      const isAttack = isMonster(card) && this.props.stage == 'attack';

      const move = isAttack ? this.props.attack : this.props.select;

      const styles: Styles[] = [];
      const skill: Styles[] = [];

      if (card.selected) {
        styles.push('selectedBorderTop');
        skill.push('selectedBorderBot');
      } else if (isAttack && (card as Monster).attacks <= 0) {
        styles.push('shadeStyle');
        skill.push('shadeStyle');
      } else if (this.props.attacker && deepCardComp(card, this.props.attacker)) {
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
    return <div style={fieldStyle}>{field} </div>;
  }
}
