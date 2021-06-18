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

const selectedBorder: React.CSSProperties = {
  border: 'solid',
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
  render() {
    const style = this.props.style ?? 'miniCardStyle';
    const finalStyle = this.props.card.selected
      ? { ...styles[style], ...selectedBorder }
      : styles[style];

    const isCharacter = this.props.card.type === CardTypes.Character;
    const isLevelCard = this.props.style === 'leveledCardStyle';

    const card = [];

    if (isLevelCard) {
      card.push(
        <img
          style={styles[style]}
          onClick={() =>
            this.props.move([this.props.location, this.props.card], this.props.skillPos)
          }
          src={cardImages[this.props.card.image].skill}
          alt={this.props.card.name}
        />
      );
    } else {
      card.push(
        <img
          style={finalStyle}
          onClick={() => this.props.move([this.props.location, this.props.card])}
          src={cardImages[this.props.card.image].top}
          alt={this.props.card.name}
        />,
        <img
          onClick={() => this.props.move([this.props.location, this.props.card], 0)}
          style={finalStyle}
          src={cardImages[this.props.card.image].skill}
          alt={this.props.card.name}
        />
      );

      if (isCharacter) {
        card.push(
          <img
            onClick={() => this.props.move([this.props.location, this.props.card], 1)}
            style={finalStyle}
            src={cardImages[this.props.card.image].skill2}
            alt={this.props.card.name}
          />,
          <img
            onClick={() => this.props.move([this.props.location, this.props.card], 2)}
            style={finalStyle}
            src={cardImages[this.props.card.image].skill3}
            alt={this.props.card.name}
          />
        );
      }
    }
    return <div style={baseStyle}>{card}</div>;
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
