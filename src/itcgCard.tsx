import React from 'react';

import { Character, NonCharacter, CardTypes } from './card';
import { Location } from './actions';
import { cardImages, cardback } from './itcgCardImages';

type Styles = keyof typeof styles;

interface CardProp {
  card: Character | NonCharacter;
  location: Location;
  move: (card: [Location, Character | NonCharacter], position?: number) => any;
  style?: Styles;
  skillPos?: number;
}

interface CardbackProp {
  style?: Styles;
}

const activatedBorder: React.CSSProperties = {
  border: 'solid',
  borderColor: 'yellow',
};

const selectedBorderTop: React.CSSProperties = {
  borderTop: 'solid',
  borderLeft: 'solid',
  borderRight: 'solid',
  borderColor: 'red',
};

const selectedBorderMid: React.CSSProperties = {
  borderLeft: 'solid',
  borderRight: 'solid',
  borderColor: 'red',
};

const selectedBorderBot: React.CSSProperties = {
  borderLeft: 'solid',
  borderRight: 'solid',
  borderBottom: 'solid',
  borderColor: 'red',
};

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const styles = {
  leveledCardStyle: {
    objectFit: 'cover',
    objectPosition: '0 100%',
    width: '80%',
  } as React.CSSProperties,
  characterStyle: {
    width: '80%',
  } as React.CSSProperties,
  miniCardStyle: {
    width: '79px',
  } as React.CSSProperties,
};

export class ITCGCard extends React.Component<CardProp> {
  getCharacter(style: React.CSSProperties) {
    const card = this.props.card as Character;

    const topStyle = card.selected ? { ...style, ...selectedBorderTop } : style;

    const skill1Style = card.selected
      ? { ...style, ...selectedBorderMid }
      : card.skills[0].activated
      ? { ...style, ...activatedBorder }
      : style;

    const skill2Style = card.selected
      ? { ...style, ...selectedBorderMid }
      : card.skills[1].activated
      ? { ...style, ...activatedBorder }
      : style;

    const skill3Style = card.selected
      ? { ...style, ...selectedBorderBot }
      : card.skills[2].activated
      ? { ...style, ...activatedBorder }
      : style;

    return (
      <div style={baseStyle}>
        <img
          style={topStyle}
          onClick={() => this.props.move([this.props.location, this.props.card])}
          src={cardImages[this.props.card.image].top}
          alt={this.props.card.name}
        />
        <img
          onClick={() => this.props.move([this.props.location, this.props.card], 0)}
          style={skill1Style}
          src={cardImages[this.props.card.image].skill}
          alt={this.props.card.name}
        />
        <img
          onClick={() => this.props.move([this.props.location, this.props.card], 1)}
          style={skill2Style}
          src={cardImages[this.props.card.image].skill2}
          alt={this.props.card.name}
        />
        <img
          onClick={() => this.props.move([this.props.location, this.props.card], 2)}
          style={skill3Style}
          src={cardImages[this.props.card.image].skill3}
          alt={this.props.card.name}
        />
      </div>
    );
  }

  getLevel(style: React.CSSProperties) {
    const finalStyle = (this.props.card as NonCharacter).skill.activated
      ? { ...style, ...activatedBorder }
      : this.props.card.selected
      ? { ...style, ...selectedBorderTop, ...selectedBorderBot }
      : style;

    return (
      <div style={baseStyle}>
        <img
          style={finalStyle}
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
    const topStyle = this.props.card.selected
      ? { ...style, ...selectedBorderTop }
      : style;

    const botStyle = this.props.card.selected
      ? { ...style, ...selectedBorderBot }
      : style;

    return (
      <div style={baseStyle}>
        <img
          style={topStyle}
          onClick={() => this.props.move([this.props.location, this.props.card])}
          src={cardImages[this.props.card.image].top}
          alt={this.props.card.name}
        />
        <img
          style={botStyle}
          onClick={() => this.props.move([this.props.location, this.props.card], 0)}
          src={cardImages[this.props.card.image].skill}
          alt={this.props.card.name}
        />
      </div>
    );
  }

  render() {
    const style = this.props.style ?? 'miniCardStyle';

    const isCharacter = this.props.card.type === CardTypes.Character;
    const isLevelCard = this.props.style === 'leveledCardStyle';

    if (isLevelCard) return this.getLevel(styles[style]);
    if (isCharacter) return this.getCharacter(styles[style]);

    return this.getCard(styles[style]);
  }
}

export class ITCGCardback extends React.Component<CardbackProp> {
  render() {
    const style = this.props.style ?? 'miniCardStyle';

    return (
      <div style={baseStyle}>
        <img style={styles[style]} alt="cardback" src={cardback} />{' '}
      </div>
    );
  }
}
