import React from 'react';
import { ParagraphStyle } from './overall.css';

const baseStyle: React.CSSProperties = {
  margin: '1%',
  display: 'flex',
  flexDirection: 'column',
};

export class ITCGDevLog extends React.Component {
  devNotes() {
    return (
      <>
        <p style={ParagraphStyle}>
          <b>November 28, 2022</b> Reworked website look and feel. Used{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.getpapercss.com/"
          >
            Paper CSS
          </a>
          , changed wording, added color, and moved content.
        </p>
        <p style={ParagraphStyle}>
          <b>May 6, 2022</b> Updated UI and UX in game and included a background image.
          Only cards not yet implemented in Set 1 are 'MP Eater' and 'Blue Diros', and
          included cards that are not currently working are 'Knowledge is Power' and
          'Pull'.
        </p>
        <p style={ParagraphStyle}>
          <b>November 18, 2021</b> Added more cards: all cards available in game are fully
          functional, and all characters are now available. Included a 'How to Play'
          guide, helpful images to be added in next update.
        </p>
        <p style={ParagraphStyle}>
          <b>October 28, 2021</b> Added more cards: Most easily added cards are now
          available, technically more difficult cards are in the pipeline; Common
          characters for all classes now available. Updated UI: View discard piles and
          decks, interact with them through a pop-up dialog box; Added card viewer in deck
          builder. Backend game state updated: Clients now do not have access to all game
          data (deck and deck order, opponent's hand). Upcoming updates will include more
          cards and fix those currently broken (Golden Crow, Buffy, Emerald Earrings).
        </p>
        <p style={ParagraphStyle}>
          <b>October 2021</b> Currently only part of the first set (base set) is
          available, and I'll be adding cards over the next week. If there are cards from
          the first set you'd like to be prioritized, please let me know in the discord
          server. If you would like to contribute and/or submit PR's, please note so in
          the discord server and I'll make the repository public.
          <br />
        </p>
      </>
    );
  }

  render() {
    return (
      <div style={baseStyle}>
        <h2>Dev Log</h2>
        {this.devNotes()}
      </div>
    );
  }
}
