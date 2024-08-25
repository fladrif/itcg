import React from 'react';

import { Character, NonCharacter, isMonster, CardTypes } from './card';
import { Location } from './target';
import { cardImages, cardback } from './itcgCardImages';
import { MoveOptions } from './moves';

interface CardProp {
  card: Character | NonCharacter;
  location: Location;
  move: (opts: MoveOptions) => any;
  styles: Styles[];
  skill0: Styles[];
  skill1: Styles[];
  skill2: Styles[];
  skillPos?: number;
  expandable?: boolean;
}

interface CardState {
  styles: Styles[];
  skill0: Styles[];
  skill1: Styles[];
  skill2: Styles[];
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

const markStyle: React.CSSProperties = {
  borderRadius: '0.53em',
  color: 'white',
  position: 'absolute',
  padding: '0.2em',
  top: '80%',
  fontSize: '1vw',
};

const damageStyle: React.CSSProperties = {
  ...markStyle,
  right: '5%',
  backgroundColor: 'red',
};

const attackStyle: React.CSSProperties = {
  ...markStyle,
  left: '5%',
  backgroundColor: 'blue',
};

const activatedBorderTop: React.CSSProperties = {
  borderTop: 'solid gold',
  borderLeft: 'solid gold',
  borderRight: 'solid gold',
};

const activatedBorderBot: React.CSSProperties = {
  borderLeft: 'solid gold',
  borderRight: 'solid gold',
  borderBottom: 'solid gold',
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
  width: '14vw',
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

export class ITCGCard extends React.Component<CardProp, CardState> {
  static defaultProps = {
    styles: [],
    skill0: [],
    skill1: [],
    skill2: [],
  };

  constructor(props: CardProp) {
    super(props);
    this.state = {
      styles: [],
      skill0: [],
      skill1: [],
      skill2: [],
    };
  }

  expandable(): boolean {
    return this.props.expandable === undefined || this.props.expandable === true;
  }

  getCharacter(style: React.CSSProperties) {
    const skill0Style = getStyles([...this.props.skill0, ...this.state.skill0]);
    const skill1Style = getStyles([...this.props.skill1, ...this.state.skill1]);
    const skill2Style = getStyles([...this.props.skill2, ...this.state.skill2]);

    return (
      <div style={baseStyle}>
        <img
          className="no-border no-responsive"
          style={style}
          onClick={() =>
            this.props.move({ card: [this.props.location, this.props.card] })
          }
          src={cardImages[this.props.card.image].top}
          alt={this.props.card.name}
        />
        <img
          className="no-border no-responsive"
          onClick={() =>
            this.props.move({ card: [this.props.location, this.props.card], position: 0 })
          }
          style={skill0Style}
          src={cardImages[this.props.card.image].skill}
          alt={this.props.card.name}
        />
        <img
          className="no-border no-responsive"
          onClick={() =>
            this.props.move({ card: [this.props.location, this.props.card], position: 1 })
          }
          style={skill1Style}
          src={cardImages[this.props.card.image].skill2}
          alt={this.props.card.name}
        />
        <img
          className="no-border no-responsive"
          onClick={() =>
            this.props.move({ card: [this.props.location, this.props.card], position: 2 })
          }
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
          className="no-border no-responsive"
          style={style}
          onClick={() =>
            this.props.move({
              card: [this.props.location, this.props.card],
              position: this.props.skillPos,
            })
          }
          src={cardImages[this.props.card.image].skill}
          alt={this.props.card.name}
        />
      </div>
    );
  }

  getCard(style: React.CSSProperties) {
    const damageMarker =
      isMonster(this.props.card) &&
      (this.props.location === Location.Field ||
        this.props.location === Location.OppField) ? (
        <div style={damageStyle}>
          {this.props.card.health - this.props.card.damageTaken}
        </div>
      ) : undefined;

    const attMarker =
      isMonster(this.props.card) &&
      (this.props.location === Location.Field ||
        this.props.location === Location.OppField) ? (
        <div style={attackStyle}>{this.props.card.attack}</div>
      ) : undefined;

    return (
      <div style={baseStyle}>
        <img
          className="no-border no-responsive"
          style={style}
          onClick={() =>
            this.props.move({ card: [this.props.location, this.props.card] })
          }
          src={cardImages[this.props.card.image].top}
          alt={this.props.card.name}
        />
        <img
          className="no-border no-responsive"
          style={getStyles([...this.props.skill0, ...this.state.skill0])}
          onClick={() =>
            this.props.move({ card: [this.props.location, this.props.card], position: 0 })
          }
          src={cardImages[this.props.card.image].skill}
          alt={this.props.card.name}
        />
        {attMarker}
        {damageMarker}
      </div>
    );
  }

  render() {
    const style = this.props.styles
      ? getStyles([...this.props.styles, ...this.state.styles])
      : defaultStyle;

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
        <img
          className="no-border no-responsive"
          style={style}
          alt="cardback"
          src={cardback}
        />
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
