import React from 'react';

import { ParagraphStyle } from './overall.css';

const baseStyle: React.CSSProperties = {
  margin: '1%',
  display: 'flex',
  flexDirection: 'column',
};

export class ITCGFrontPage extends React.Component {
  intro() {
    return (
      <>
        <p style={ParagraphStyle}>
          <b>
            To build decks and/or play games against others, please log in or sign up.
          </b>
        </p>
        <div className="row flex-spaces">
          <div className="lrg-6 col">
            <a className="paper-btn btn-large btn-block btn-success" href="/login">
              Log In
            </a>
          </div>
          <div className="lrg-6 col">
            <a
              className="paper-btn btn-large btn-block btn-success-outline"
              href="/signup"
            >
              Sign Up
            </a>
          </div>
        </div>
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
          You can use the discord server on the <a href="/about">about page</a> to report
          those issues as they come up and I'll do my best to address them. This
          application uses{' '}
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
    return (
      <div style={baseStyle}>
        <h2>Welcome Maplers!</h2>
        {this.intro()}
      </div>
    );
  }
}
