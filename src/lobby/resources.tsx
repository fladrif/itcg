import React from 'react';

const baseStyle: React.CSSProperties = {
  margin: '1%',
  display: 'flex',
  flexDirection: 'column',
};

export class ITCGResources extends React.Component {
  links() {
    return (
      <>
        <p>
          For a database (deck lists, documents) of the game, visit{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://cardgamegeek.com/games/msitcg"
          >
            Card Game Geek
          </a>
        </p>
        <p>
          For a guide to the game, please refer to the fan site{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://itcg.maplestorygameguide.com/"
          >
            Maplestory Game Guide
          </a>
        </p>
        <p>
          The original rules to the game can be found in the{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://archive.org/details/mpss-01-pdf-rules"
          >
            Internet Archive
          </a>
          .
        </p>
        <p>
          For matchmaking, finding other players, getting help for this site, geek out on
          MapleStory iTCG, or to report issues, join the{' '}
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
            Kevin
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
