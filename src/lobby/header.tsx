import React from 'react';

import header from '../images/itcgCBsk2.jpg';
import { MAX_WIDTH } from '../config';

interface HeaderProps {
  username?: string;
  isAdmin?: boolean;
}

const baseStyle: React.CSSProperties = {
  position: 'sticky',
  background: 'linear-gradient(0.25turn, #FC4336, 20%, #F08C56)',
  paddingLeft: `calc(calc(100vw - ${MAX_WIDTH})/2)`,
  paddingRight: `calc(calc(100vw - ${MAX_WIDTH})/2)`,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
};

const headerImageStyle: React.CSSProperties = {
  width: '2em',
};

export class ITCGHeader extends React.Component<HeaderProps> {
  addtlMenu = (
    <>
      <li>
        <a href="/cards">Cards</a>
      </li>
      <li>
        <a href="/howtoplay">How To Play</a>
      </li>
      <li>
        <a href="/about">About</a>
      </li>
    </>
  );

  loggedInUI() {
    return (
      <li>
        <a href="/logout">Log Out</a>
      </li>
    );
  }

  loggedOutUI() {
    return (
      <>
        <li>
          <a href="/login"> Log In </a>
        </li>
        <li>
          <a href="/signup"> Sign Up </a>
        </li>
      </>
    );
  }

  loggedOutMenu() {
    return (
      <ul className="inline">
        <li>
          <a href="/">Home</a>
        </li>
        {this.addtlMenu}
        <li>|</li>
        {this.loggedOutUI()}
      </ul>
    );
  }

  adminMenu() {
    return (
      <>
        <li>
          <a href="/admin">Stats</a>
        </li>
      </>
    );
  }

  loggedInMenu() {
    return (
      <ul className="inline">
        {!!this.props.isAdmin && this.adminMenu()}
        <li>
          <a href="/">Tables</a>
        </li>
        <li>
          <a href="/decks">Decks</a>
        </li>
        {this.addtlMenu}
        <li>|</li>
        {this.loggedInUI()}
      </ul>
    );
  }

  render() {
    const loggedIn = !!this.props.username;

    return (
      <nav style={baseStyle} className="border fixed split-nav border-3">
        <div className="nav-brand" style={headerStyle}>
          <a href="/">
            <img
              src={header}
              style={headerImageStyle}
              rel="preload"
              alt="Stylized sketch card back"
            />
          </a>
        </div>
        <div className="collapsible">
          <input id="collapsible1" type="checkbox" name="collapsible1" />
          <label htmlFor="collapsible1">
            <div className="bar1">-</div>
            <div className="bar3">-</div>
          </label>
          <div className="collapsible-body">
            {!loggedIn && this.loggedOutMenu()}
            {loggedIn && this.loggedInMenu()}
          </div>
        </div>
      </nav>
    );
  }
}
