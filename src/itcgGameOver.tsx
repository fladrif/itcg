import React from 'react';

interface GameOverProp {
  won: boolean;
}

const baseStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '5% 10% 70% 10% 5% ',
  gridTemplateRows: '5% 15% 60% 15% 5%',
  gridTemplateAreas:
    "'. . . . .' '. . . . .' '. . mesg . .' '. . . button .' '. . . . .'",
  width: '50vw',
  height: '33vh',
  lineHeight: '33vh',
  borderRadius: '4em',
  textAlign: 'center',
  textShadow:
    '2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
  backgroundColor: 'rgba(84, 84, 84, 0.5)',
};

const winStyle: React.CSSProperties = {
  border: 'solid blue',
};

const lossStyle: React.CSSProperties = {
  border: 'solid red',
};

const mesgStyle: React.CSSProperties = {
  fontSize: '3vw',
  alignSelf: 'center',
  gridArea: 'mesg',
};

const buttonStyle: React.CSSProperties = {
  fontSize: '1.3vw',
  borderRadius: '0.25em',
  gridArea: 'button',
};

export class ITCGGameOver extends React.Component<GameOverProp> {
  reload() {
    window.location.reload();
  }

  render() {
    const won = this.props.won ? 'You Won!' : 'You Lost..';
    const style = this.props.won
      ? { ...baseStyle, ...winStyle }
      : { ...baseStyle, ...lossStyle };

    return (
      <div style={style}>
        <div style={mesgStyle}>{won}</div>
        <button style={buttonStyle} onClick={this.reload.bind(this)}>
          Leave
        </button>
      </div>
    );
  }
}
