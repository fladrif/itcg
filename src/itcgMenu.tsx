import React from 'react';

import { State as BoardState } from './itcgBoard';
import gear from './images/gear.png';

interface MenuProp {
  updateBoard: (state: BoardState) => any;
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
};

const buttonStyle: React.CSSProperties = {
  borderRadius: '0.3em',
  backgroundImage: `url(${gear})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  margin: '10%',
};

export class ITCGMenu extends React.Component<MenuProp> {
  constructor(props: MenuProp) {
    super(props);
  }

  openMenu() {
    this.props.updateBoard({ menuBox: 'menu' });
  }

  render() {
    return (
      <div style={baseStyle}>
        <button style={buttonStyle} onClick={() => this.openMenu()}></button>
      </div>
    );
  }
}
