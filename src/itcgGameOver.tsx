import React from 'react';

interface GameOverProp {
  won: boolean;
}

const baseStyle: React.CSSProperties = {
  width: '50vw',
  height: '33vh',
  lineHeight: '33vh',
  borderRadius: '2em',
  textAlign: 'center',
  textShadow:
    '2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
  backgroundColor: 'rgba(84, 84, 84, 0.5)',
  fontSize: '42px',
};

const winStyle: React.CSSProperties = {
  border: 'solid blue',
};

const lossStyle: React.CSSProperties = {
  border: 'solid red',
};

export class ITCGGameOver extends React.Component<GameOverProp> {
  render() {
    const won = this.props.won ? 'You Won!' : 'You Lost..';
    const style = this.props.won
      ? { ...baseStyle, ...winStyle }
      : { ...baseStyle, ...lossStyle };

    return <div style={style}>{won}</div>;
  }
}
