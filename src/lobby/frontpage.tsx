import React from 'react';

interface FrontPageProps {
  username?: string;
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '60vw',
};

const paragraphStyle: React.CSSProperties = {
  textIndent: '5%',
  lineHeight: '175%',
};

export class ITCGFrontPage extends React.Component<FrontPageProps> {
  navigation() {
    return (
      <>
        <h3>Navigation</h3>
        <p style={paragraphStyle}>
          <b>Rooms</b>: Find opponents to play games against
        </p>
        <p style={paragraphStyle}>
          <b>Decks</b>: Create and modify your own decks
        </p>
      </>
    );
  }

  welcome() {
    return (
      <>
        <h3>Welcome!</h3>
        <p style={paragraphStyle}>
          To create your own decks and play games, please log in or sign up above for an
          account to start. We do not ask for or use your email address.
        </p>
      </>
    );
  }

  intro() {
    return (
      <>
        <p style={paragraphStyle}>
          Maplestory iTCG is an interactive trading card game developed by Wizards of the
          Coasts in partnership with Nexon based on the Korean MMO (massive multiplayer
          online) game Maplestory. The game was printed in physical card form with codes
          redeemable in the Maplestory MMO for unique items, and released as a short-lived
          online game which has since been taken down.
        </p>
        <p style={paragraphStyle}>
          This site is an enthusiast attempt to make the game available online without
          having to install applications and manage game rules on your own. (For example
          with LackeyCCG, or Tabletop Simulator). Because of this, there will undoubtedly
          be issues or missing features that you would expect from a more mature site. You
          can use the discord link below to report those issues as they come up and I'll
          do my best to address them. This application uses{' '}
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

  devNotes() {
    return (
      <>
        <p style={paragraphStyle}>
          <b>September 2021</b> Currently only the first set of cards (base set) is
          available. Adding sets of cards is a time intensive process, and will therefore
          be added as I find time. If you would like to contribute and/or submit PR's,
          please note so in the discord server and I'll make the repository public.
        </p>
      </>
    );
  }

  links() {
    return (
      <>
        <p>
          For a guide to the game, you can reference the fan site{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://itcg.maplestorygameguide.com/"
          >
            Maplestory Game Guide
          </a>
        </p>
        <p>
          For help on this site in particular or to report issues, please use the{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.gg/bSDu2UaJwK"
          >
            Discord
          </a>{' '}
          server
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
        <h3>Dev Notes</h3>
        {this.devNotes()}
        <h3>Links</h3>
        {this.links()}
      </div>
    );
  }
}
