import React from 'react';

import { State as BoardState } from './itcgBoard';

interface MenuProp {
  updateBoard: (state: BoardState) => any;
}

const baseStyle: React.CSSProperties = {};

const buttonStyle: React.CSSProperties = {
  alignSelf: 'center',
  width: '20%',
  fontSize: '50%',
  borderRadius: '0.5em',
};

export class ITCGMenu extends React.Component<MenuProp> {
  constructor(props: MenuProp) {
    super(props);
  }

  concede() {
    this.props.updateBoard({ menuBox: 'menu' });
  }

  render() {
    return (
      <div style={baseStyle}>
        <button style={buttonStyle} onClick={() => this.concede()}>
          Menu
        </button>
      </div>
    );
  }
}
