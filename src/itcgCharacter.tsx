import React from 'react';

import { PlayerState } from './game';
import { Location } from './actions';
import { meetsSkillReq } from './utils';

import { Styles, ITCGCard } from './itcgCard';

export interface CharacterProp {
  playerState: PlayerState;
  currentPlayer: boolean;
  stage: string;
  activate: () => any;
  select: () => any;
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  alignItems: 'center',
  width: '100%',
  height: '100%',
};

export class ITCGCharacter extends React.Component<CharacterProp> {
  render() {
    const move = this.props.stage == 'activate' ? this.props.activate : this.props.select;

    const skillCards = this.props.playerState.learnedSkills.map((card, index) => {
      const levelStyles: Styles[] = ['leveledCardStyle'];

      if (card.skill.activated) {
        levelStyles.push('activatedBorderTop', 'activatedBorderBot');
      } else if (card.selected) {
        levelStyles.push('selectedBorderTop', 'selectedBorderBot');
      } else if (
        this.props.playerState &&
        this.props.stage === 'activate' &&
        !meetsSkillReq(card.skill.requirements, this.props.playerState)
      ) {
        levelStyles.push('shadeStyle');
      }

      return (
        <ITCGCard
          styles={levelStyles}
          location={Location.CharAction}
          card={card}
          move={move}
          skillPos={index + 3}
          key={card.key}
        />
      );
    });

    const character = this.props.playerState.character;

    const topStyle: Styles[] = ['characterStyle'];
    const skillStyle: Styles[][] = [];
    skillStyle[0] = ['characterStyle'];
    skillStyle[1] = ['characterStyle'];
    skillStyle[2] = ['characterStyle'];

    if (character.selected) {
      topStyle.push('selectedBorderTop');
      skillStyle[0].push('selectedBorderMid');
      skillStyle[1].push('selectedBorderMid');
      skillStyle[2].push('selectedBorderBot');
    }

    character.skills.map((skill, idx) => {
      if (skill.activated)
        skillStyle[idx].push('activatedBorderTop', 'activatedBorderBot');
      if (
        this.props.stage === 'activate' &&
        !meetsSkillReq(skill.requirements, this.props.playerState)
      ) {
        skillStyle[idx].push('shadeStyle');
      }
    });

    return (
      <div style={baseStyle}>
        <ITCGCard
          location={this.props.currentPlayer ? Location.Character : Location.OppCharacter}
          card={character}
          styles={topStyle}
          skill0={skillStyle[0]}
          skill1={skillStyle[1]}
          skill2={skillStyle[2]}
          move={move}
          key={character.key}
        />
        {skillCards}
      </div>
    );
  }
}
