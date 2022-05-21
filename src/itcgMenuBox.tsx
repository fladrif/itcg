import React from 'react';

import { State as BoardState } from './itcgBoard';

interface MenuBoxProp {
  updateBoard: (state: BoardState) => any;
  menuBox?: MenuBoxOpts;
}

export type MenuBoxOpts = 'menu' | 'concede' | 'music';

const baseStyle: React.CSSProperties = {
  display: 'flex',
  width: '100vw',
  height: '100vh',
  justifyContent: 'center',
  backgroundColor: 'rgba(84, 84, 84, 0.5)',
};

const innerBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textShadow:
    '2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
  textAlign: 'center',
  width: '33vw',
  height: '100vh',
  fontSize: '3vw',
  backgroundColor: 'rgba(84, 84, 84, 0.5)',
};

const buttonStyle: React.CSSProperties = {
  alignSelf: 'center',
  borderRadius: '0.5em',
  marginTop: '5%',
  fontSize: '2vw',
  paddingLeft: '5%',
  paddingRight: '5%',
};

export class ITCGMenuBox extends React.Component<MenuBoxProp> {
  concede() {
    this.props.updateBoard({ menuBox: 'concede' });
  }

  back() {
    this.props.updateBoard({ menuBox: undefined });
  }

  yes() {
    this.props.updateBoard({ menuBox: undefined });
  }

  menu() {
    this.props.updateBoard({ menuBox: 'menu' });
  }

  music() {
    this.props.updateBoard({ menuBox: 'music' });
  }

  mainMenu = (
    <>
      Menu
      <button style={buttonStyle} onClick={() => this.music()}>
        Music
      </button>
      <button
        className="btn-primary-outline"
        style={buttonStyle}
        onClick={() => this.back()}
      >
        Back
      </button>
      <button
        className="btn-danger-outline"
        style={buttonStyle}
        onClick={() => this.concede()}
      >
        Concede
      </button>
    </>
  );

  concedeMenu = (
    <>
      Concede the game?
      <button
        className="btn-primary-outline"
        style={buttonStyle}
        onClick={() => this.menu()}
      >
        No
      </button>
      <button
        className="btn-danger-outline"
        style={buttonStyle}
        onClick={() => this.yes()}
      >
        Yes
      </button>
    </>
  );

  musicMenu = (
    <>
      Music Control
      <button style={buttonStyle} onClick={() => this.yes()}>
        Mute
      </button>
      <button
        className="btn-primary-outline"
        style={buttonStyle}
        onClick={() => this.menu()}
      >
        Back
      </button>
    </>
  );

  render() {
    if (this.props.menuBox === undefined) return null;

    return (
      <div style={baseStyle}>
        <div style={innerBoxStyle}>
          {this.props.menuBox === 'menu' && this.mainMenu}
          {this.props.menuBox === 'concede' && this.concedeMenu}
          {this.props.menuBox === 'music' && this.musicMenu}
        </div>
      </div>
    );
  }
}
