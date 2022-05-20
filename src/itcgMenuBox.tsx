import React from 'react';

import { State as BoardState } from './itcgBoard';

interface MenuBoxProp {
  updateBoard: (state: BoardState) => any;
  menuBox?: MenuBoxOpts;
}

export type MenuBoxOpts = 'menu' | 'concede';

const baseStyle: React.CSSProperties = {
  display: 'grid',
  width: '33vw',
  height: '33vh',
  borderRadius: '1em',
  textAlign: 'center',
  textShadow:
    '2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
  backgroundColor: 'rgba(84, 84, 84, 0.5)',
};

const buttonStyle: React.CSSProperties = {
  alignSelf: 'center',
  width: '20%',
  fontSize: '50%',
  borderRadius: '0.5em',
};

export class ITCGMenuBox extends React.Component<MenuBoxProp> {
  concede() {
    this.props.updateBoard({ menuBox: 'concede' });
  }

  back() {
    this.props.updateBoard({ menuBox: undefined });
  }

  render() {
    if (this.props.menuBox === undefined) return null;

    return (
      <div style={baseStyle}>
        <button style={buttonStyle} onClick={() => this.concede()}>
          Concede
        </button>
        <button style={buttonStyle} onClick={() => this.back()}>
          Return
        </button>
      </div>
    );
  }
}
