import { Ctx } from 'boardgame.io';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { GameState, PlayerState } from './game';
import { Location } from './target';
import { every, passSkillReqToActivate } from './utils';
import { Styles, ITCGCard } from './itcgCard';
import { skillDict } from './skill';
import { Decision, isSelectable } from './stack';

export interface CharacterProp {
  G: GameState;
  ctx: Ctx;
  curDecision?: Decision;
  playerState: PlayerState;
  currentPlayer: boolean;
  stage: string;
  turn: number;
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
  getSkillCards(move: () => any) {
    return this.props.playerState.learnedSkills.map((card, index) => {
      const levelStyles: Styles[] = ['leveledCardStyle'];

      if (card.skill.activated) {
        levelStyles.push('activatedBorderTop', 'activatedBorderBot');
      } else if (card.selected) {
        levelStyles.push('selectedBorderTop', 'selectedBorderBot');
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
        levelStyles.push('selectableBorderTop', 'selectableBorderBot');
      } else if (
        this.props.playerState &&
        this.props.stage === 'activate' &&
        every(
          skillDict[card.skill.name],
          (sk) =>
            !passSkillReqToActivate(sk.requirements, this.props.playerState) ||
            this.props.playerState.activationPos > index + 3
        )
      ) {
        levelStyles.push('shadeStyle');
      }

      return (
        <div
          data-tooltip-id="expanded-card"
          data-tooltip-html={renderToStaticMarkup(
            <ITCGCard
              move={() => {}}
              location={
                this.props.currentPlayer ? Location.CharAction : Location.OppCharAction
              }
              styles={['expandStyle']}
              skill0={['expandStyle']}
              card={card}
              key={card.key}
            />
          )}
        >
          <ITCGCard
            styles={levelStyles}
            location={
              this.props.currentPlayer ? Location.CharAction : Location.OppCharAction
            }
            card={card}
            move={move}
            skillPos={index + 3}
            key={card.key}
          />
        </div>
      );
    });
  }

  render() {
    const move = this.props.stage == 'activate' ? this.props.activate : this.props.select;

    const skillCards = this.getSkillCards(move);

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
    } else if (
      this.props.curDecision &&
      isSelectable(
        this.props.G,
        this.props.ctx,
        this.props.playerState,
        this.props.curDecision,
        character
      )
    ) {
      topStyle.push('selectableBorderTop');
      skillStyle[0].push('selectableBorderMid');
      skillStyle[1].push('selectableBorderMid');
      skillStyle[2].push('selectableBorderBot');
    }

    character.skills.map((skill, idx) => {
      if (skill.activated) {
        skillStyle[idx].push('activatedBorderTop', 'activatedBorderBot');
      }

      if (
        this.props.stage === 'activate' &&
        every(skillDict[skill.name], (sk) => {
          return (
            !passSkillReqToActivate(sk.requirements, this.props.playerState) ||
            this.props.playerState.activationPos > idx
          );
        })
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
