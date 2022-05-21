import React from 'react';
import { Link } from 'react-router-dom';
import { ParagraphStyle } from './overall.css';

interface FrontPageProps {
  username?: string;
}

const baseStyle: React.CSSProperties = {
  marginTop: '1%',
  display: 'flex',
  flexDirection: 'column',
  width: '60vw',
};

const buttonDivStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
};

const buttonStyle: React.CSSProperties = {
  padding: '2em',
  margin: '1em',
};

export class ITCGFrontPage extends React.Component<FrontPageProps> {
  navigation() {
    return (
      <>
        <h2>Welcome back {this.props.username}!</h2>
        <div style={buttonDivStyle}>
          <Link to={'/rooms'}>
            <button style={buttonStyle}>
              <h3>Room</h3>
              Challenge others to a game
            </button>
          </Link>
          <Link to={'/decks'}>
            <button style={buttonStyle}>
              <h3>Deck</h3>
              Build and modify decks
            </button>
          </Link>
        </div>
      </>
    );
  }

  welcome() {
    return (
      <>
        <h2>Welcome!</h2>
        <p style={ParagraphStyle}>
          To create your own decks and play games, please log in or sign up above for an
          account to start. We do not ask for or use your email address.
        </p>
      </>
    );
  }

  intro() {
    return (
      <>
        <p style={ParagraphStyle}>
          Maplestory iTCG is an interactive trading card game developed by Wizards of the
          Coasts in partnership with Nexon based on the Korean MMO (massive multiplayer
          online) game Maplestory. The game was printed in physical card form with codes
          redeemable in the Maplestory MMO for unique items, and released as a short-lived
          online game which has since been taken down.
        </p>
        <p style={ParagraphStyle}>
          This site is an enthusiast attempt to make the game available online without
          having to install applications and manage game rules on your own. (For example
          with LackeyCCG, or Tabletop Simulator). Because of this, there will undoubtedly
          be issues or missing features that you would expect from a more mature site.
          This site is also optimized for desktop use, mobile is viable but not supported.
          You can use the discord link below to report those issues as they come up and
          I'll do my best to address them. This application uses{' '}
          <a target="_blank" ref="noopener noreferrer" href="https://boardgame.io">
            BoardGame IO
          </a>{' '}
          as the framework that drives the game and maintains state. This has been a
          passion projejct of mine for the past several months and hopefully you find this
          exciting and/or enjoyable as well! Happy Mapling!
        </p>
      </>
    );
  }

  render() {
    const loggedIn = !!this.props.username;

    return (
      <div style={baseStyle}>
        {!loggedIn && this.welcome()}
        {loggedIn && this.navigation()}
        <h3>Intro</h3>
        {this.intro()}
      </div>
    );
  }
}
