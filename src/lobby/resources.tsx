import React from 'react';

const baseStyle: React.CSSProperties = {
  marginTop: '1%',
  display: 'flex',
  flexDirection: 'column',
  width: '60vw',
};

export class ITCGResources extends React.Component {
  links() {
    return (
      <>
        <p>
          For a database (deck lists, documents) of the game, you can visit{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://cardgamegeek.com/games/msitcg"
          >
            Card Game Geek
          </a>
        </p>
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
          For matchmaking and/or finding players, help on this site in particular, or to
          report issues, please use the{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.gg/bSDu2UaJwK"
          >
            Discord
          </a>{' '}
          server
        </p>
        <p>
          Background art and music by{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://knhy.me/">
            knhy.me
          </a>
        </p>
      </>
    );
  }

  render() {
    return (
      <div style={baseStyle}>
        <h2>Resources</h2>
        {this.links()}
      </div>
    );
  }
}
