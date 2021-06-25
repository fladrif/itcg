import React from 'react';

import { Character, NonCharacter, CardTypes } from './card';
import { Location } from './actions';
import { cardImages, cardback } from './itcgCardImages';

interface CardProp {
  card: Character | NonCharacter;
  location: Location;
  move: (card: [Location, Character | NonCharacter], position?: number) => any;
  styles: Styles[];
  skill0?: Styles[];
  skill1?: Styles[];
  skill2?: Styles[];
  skillPos?: number;
}

interface CardbackProp {
  styles?: Styles;
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
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
  width: '80%',
};

const characterStyle: React.CSSProperties = {
  width: '80%',
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
};

export type Styles = keyof typeof styles;

export class ITCGCard extends React.Component<CardProp> {
  static defaultProps = {
    styles: [],
  };

  getCharacter(style: React.CSSProperties) {
    const skill0Style = this.props.skill0 ? getStyles(this.props.skill0) : defaultStyle;
    const skill1Style = this.props.skill1 ? getStyles(this.props.skill1) : defaultStyle;
    const skill2Style = this.props.skill2 ? getStyles(this.props.skill2) : defaultStyle;

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
    return (
      <div style={baseStyle}>
        <img
          style={style}
          onClick={() => this.props.move([this.props.location, this.props.card])}
          src={cardImages[this.props.card.image].top}
          alt={this.props.card.name}
        />
        <img
          style={getStyles(this.props.skill0 ? this.props.skill0 : [])}
          onClick={() => this.props.move([this.props.location, this.props.card], 0)}
          src={cardImages[this.props.card.image].skill}
          alt={this.props.card.name}
        />
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
    const style = defaultStyle;

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
