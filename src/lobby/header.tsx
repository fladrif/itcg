import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import header from '../images/itcgCBsk2.jpg';

interface HeaderProps {
  username?: string;
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  width: '100vw',
};

const titleImageStyle: React.CSSProperties = {
  marginTop: '1%',
  marginLeft: '3%',
  alignSelf: 'start',
};

const titleStyle: React.CSSProperties = {
  marginTop: '1%',
  marginLeft: '1%',
  alignSelf: 'start',
};

const menuStyle: React.CSSProperties = {
  flex: '1',
  display: 'flex',
  marginLeft: '3%',
  alignSelf: 'end',
};

const menuItem: React.CSSProperties = {
  padding: '1%',
  marginLeft: '1%',
  borderTop: 'groove',
  borderLeft: 'groove',
  borderRight: 'groove',
  textDecoration: 'none',
  color: 'black',
};

const UIStyle: React.CSSProperties = {
  marginTop: '1%',
  marginRight: '3%',
  alignSelf: 'center',
};

const headerImageStyle: React.CSSProperties = {
  width: '6em',
};

export class ITCGHeader extends React.Component<HeaderProps> {
  loggedInUI() {
    return (
      <>
        <div>
          Welcome <b>{this.props.username}</b>
        </div>
        <Link to={'/logout'}>
          <button type={'button'}>Log Out</button>
        </Link>
      </>
    );
  }

  loggedOutUI() {
    return (
      <>
        <Link to={'/login'}>
          <button type={'button'}>Log In</button>
        </Link>
        <Link to={'/signup'}>
          <button type={'button'}>Sign Up</button>
        </Link>
      </>
    );
  }

  loggedInMenu() {
    return (
      <>
        <NavLink style={menuItem} to={'/'}>
          Home
        </NavLink>
        <NavLink style={menuItem} to={'/rooms'}>
          Rooms
        </NavLink>
        <NavLink style={menuItem} to={'/decks'}>
          Decks
        </NavLink>
      </>
    );
  }

  render() {
    const loggedIn = !!this.props.username;

    return (
      <div style={baseStyle}>
        <div style={titleImageStyle}>
          <Link to={'/'}>
            <img src={header} style={headerImageStyle} />
          </Link>
        </div>
        <div style={titleStyle}>
          <h1>Maplestory iTCG</h1>
          Maplestory card game web client
        </div>
        <div style={menuStyle}>{loggedIn && this.loggedInMenu()}</div>
        <div style={UIStyle}>
          {!loggedIn && this.loggedOutUI()}
          {loggedIn && this.loggedInUI()}
        </div>
      </div>
    );
  }
}
