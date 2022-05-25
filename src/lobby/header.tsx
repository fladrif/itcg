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

const selectedMenuItem: React.CSSProperties = {
  ...menuItem,
  backgroundColor: 'grey',
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
  baseMenu = (
    <>
      <NavLink activeStyle={selectedMenuItem} exact={true} style={menuItem} to={'/'}>
        Home
      </NavLink>
    </>
  );

  addtlMenu = (
    <>
      <NavLink activeStyle={selectedMenuItem} style={menuItem} to={'/howtoplay'}>
        How To Play
      </NavLink>
      <NavLink activeStyle={selectedMenuItem} style={menuItem} to={'/devlog'}>
        Dev Log
      </NavLink>
      <NavLink activeStyle={selectedMenuItem} style={menuItem} to={'/resources'}>
        Resources
      </NavLink>
    </>
  );

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

  loggedOutMenu() {
    return (
      <>
        {this.baseMenu}
        {this.addtlMenu}
      </>
    );
  }

  loggedInMenu() {
    return (
      <>
        {this.baseMenu}
        <NavLink activeStyle={selectedMenuItem} style={menuItem} to={'/rooms'}>
          Rooms
        </NavLink>
        <NavLink activeStyle={selectedMenuItem} style={menuItem} to={'/decks'}>
          Decks
        </NavLink>
        {this.addtlMenu}
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
        <div style={menuStyle}>
          {!loggedIn && this.loggedOutMenu()}
          {loggedIn && this.loggedInMenu()}
        </div>
        <div style={UIStyle}>
          {!loggedIn && this.loggedOutUI()}
          {loggedIn && this.loggedInUI()}
        </div>
      </div>
    );
  }
}
