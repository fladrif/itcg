import React from 'react';

import { Character, NonCharacter, isMonster, CardTypes } from './card';
import { Location } from './actions';
import { cardImages, cardback } from './itcgCardImages';

interface CardProp {
  card: Character | NonCharacter;
  location: Location;
  move: (card: [Location, Character | NonCharacter], position?: number) => any;
  styles: Styles[];
  skill0: Styles[];
  skill1: Styles[];
  skill2: Styles[];
  skillPos?: number;
}

interface CardbackProp {
  styles?: Styles[];
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
};

const damageStyle: React.CSSProperties = {
  color: 'white',
  backgroundColor: 'red',
  position: 'absolute',
  padding: '0.5em',
  top: '70%',
  left: '50%',
};

const activatedBorderTop: React.CSSProperties = {
  borderTop: 'solid yellow',
  borderLeft: 'solid yellow',
  borderRight: 'solid yellow',
};

const activatedBorderBot: React.CSSProperties = {
  borderLeft: 'solid yellow',
  borderRight: 'solid yellow',
  borderBottom: 'solid yellow',
};

const selectedBorderTop: React.CSSProperties = {
  borderTop: 'solid red',
  borderLeft: 'solid red',
  borderRight: 'solid red',
};

const selectedBorderMid: React.CSSProperties = {
  borderLeft: 'solid red',
  borderRight: 'solid red',
};

const selectedBorderBot: React.CSSProperties = {
  borderLeft: 'solid red',
  borderRight: 'solid red',
  borderBottom: 'solid red',
};

const shadeStyle: React.CSSProperties = {
  filter: 'brightness(50%)',
};

const defaultStyle: React.CSSProperties = {
  width: '6vw',
};

const leveledCardStyle: React.CSSProperties = {
  objectFit: 'cover',
  objectPosition: '0 100%',
  width: '90%',
};

const characterStyle: React.CSSProperties = {
  width: '90%',
};

const expandStyle: React.CSSProperties = {
  width: '100%',
  zIndex: 1,
};

const styles = {
  selectedBorderTop,
  selectedBorderMid,
  selectedBorderBot,
  activatedBorderTop,
  activatedBorderBot,
  leveledCardStyle,
  characterStyle,
  shadeStyle,
  expandStyle,
};

export type Styles = keyof typeof styles;

export class ITCGCard extends React.Component<CardProp> {
  static defaultProps = {
    styles: [],
    skill0: [],
    skill1: [],
    skill2: [],
  };

  expandCard() {
    this.props.styles.push('expandStyle');
    this.props.skill0.push('expandStyle');
    this.forceUpdate();
  }

  unexpandCard() {
    const index = this.props.styles.findIndex((style) => style === 'expandStyle');
    if (index !== -1) this.props.styles.splice(index, 1);
    const skillInd = this.props.skill0.findIndex((style) => style === 'expandStyle');
    if (skillInd !== -1) this.props.skill0.splice(skillInd, 1);
    this.forceUpdate();
  }

  getCharacter(style: React.CSSProperties) {
    const skill0Style = getStyles(this.props.skill0);
    const skill1Style = getStyles(this.props.skill1);
    const skill2Style = getStyles(this.props.skill2);

    return (
      <div style={baseStyle}>
        <img
          style={style}
          onClick={() => this.props.move([this.props.location, this.props.card])}
          src={cardImages[this.props.card.image].top}
          alt={this.props.card.name}
        />
        <img
          onClick={() => this.props.move([this.props.location, this.props.card], 0)}
          style={skill0Style}
          src={cardImages[this.props.card.image].skill}
          alt={this.props.card.name}
        />
        <img
          onClick={() => this.props.move([this.props.location, this.props.card], 1)}
          style={skill1Style}
          src={cardImages[this.props.card.image].skill2}
          alt={this.props.card.name}
        />
        <img
          onClick={() => this.props.move([this.props.location, this.props.card], 2)}
          style={skill2Style}
          src={cardImages[this.props.card.image].skill3}
          alt={this.props.card.name}
        />
      </div>
    );
  }

  getLevel(style: React.CSSProperties) {
    return (
      <div style={baseStyle}>
        <img
          style={style}
          onClick={() =>
            this.props.move([this.props.location, this.props.card], this.props.skillPos)
          }
          src={cardImages[this.props.card.image].skill}
          alt={this.props.card.name}
        />
      </div>
    );
  }

  getCard(style: React.CSSProperties) {
    const damageMarked =
      isMonster(this.props.card) && this.props.card.damageTaken > 0 ? (
        <div style={damageStyle}>{this.props.card.damageTaken}</div>
      ) : undefined;

    return (
      <div style={baseStyle}>
        <img
          style={style}
          onClick={() => this.props.move([this.props.location, this.props.card])}
          src={cardImages[this.props.card.image].top}
          alt={this.props.card.name}
          onMouseEnter={() => this.expandCard()}
          onMouseLeave={() => this.unexpandCard()}
        />
        <img
          style={getStyles(this.props.skill0)}
          onClick={() => this.props.move([this.props.location, this.props.card], 0)}
          src={cardImages[this.props.card.image].skill}
          alt={this.props.card.name}
          onMouseEnter={() => this.expandCard()}
          onMouseLeave={() => this.unexpandCard()}
        />
        {damageMarked}
      </div>
    );
  }

  render() {
    const style = this.props.styles ? getStyles(this.props.styles) : defaultStyle;

    const isCharacter = this.props.card.type === CardTypes.Character;
    const isLevelCard = this.props.styles.includes('leveledCardStyle');

    if (isLevelCard) return this.getLevel(style);
    if (isCharacter) return this.getCharacter(style);

    return this.getCard(style);
  }
}

export class ITCGCardback extends React.Component<CardbackProp> {
  render() {
    const style = this.props.styles ? getStyles(this.props.styles) : defaultStyle;

    return (
      <div style={baseStyle}>
        <img style={style} alt="cardback" src={cardback} />
      </div>
    );
  }
}

function getStyles(styles: Styles[]): React.CSSProperties {
  return styles.reduce(
    (acc, sty) => ({
      ...acc,
      ...getStyle(sty),
    }),
    defaultStyle
  );
}

function getStyle(style: Styles): React.CSSProperties {
  return styles[style];
}
