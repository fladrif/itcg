import React from 'react';
import { Ctx } from 'boardgame.io';

import { ITCGCard } from './itcgCard';
import { GameState } from './game';
import { Location } from './actions';
import { isCharacter, Character, NonCharacter } from './card';
import { getCardLocation } from './utils';

interface HighlightProp {
  state: GameState;
  ctx: Ctx;
}

const highlightStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '18%',
  paddingLeft: '1%',
  paddingRight: '1%',
  border: 'groove',
  fontSize: '150%',
  color: 'white',
  textShadow: '2px 0 5px #000, -2px 0 5px #000, 0 2px 5px #000, 0 -2px 5px #000',
  textAlign: 'center',
};

export class ITCGHighlight extends React.Component<HighlightProp> {
  render() {
    const nullMove = (card: [Location, Character | NonCharacter]) => {
      return card;
    };

    const stack = this.props.state.stack;
    if (!stack || stack.currentStage === 'attack') return null;

    const sourceEffect = stack.activeDecisions[0].opts?.source
      ? stack.activeDecisions[0].opts!.source!
      : false;
    if (!sourceEffect || isCharacter(sourceEffect)) return null;

    const cardLoc = getCardLocation(this.props.state, this.props.ctx, sourceEffect.key);
    if (cardLoc === Location.CharAction) return null;

    return (
      <div style={highlightStyle}>
        <p>Current Effect</p>
        <ITCGCard
          card={sourceEffect}
          location={Location.Field}
          move={nullMove}
          styles={['expandStyle']}
          skill0={['expandStyle']}
        />
      </div>
    );
  }
}
