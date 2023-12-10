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
          <b>December 11, 2023</b> Happy holidays! There have been a lot of changes this
          year that haven't been written up yet so a slightly longer update. First off, a
          list of fixes: Added the missing <i>Panda</i> card, corrected the level for{' '}
          <i>Dark Shadow</i>, fixed functionality for <i>Knowledge is Power</i>,{' '}
          <i>Pull</i>, <i>Teleport</i>, and <i>Lucida</i>. Solved a bug that caused
          variety of issues that ended in a stuck or improper game state. Overhauled the
          homepage and How to Play guide, added images, information cards, and better
          organization to present the game and client in a more comprehensive manner.
          Included a concede option in a new in-game menu. Added great in-game music,
          several tracks from <b>Kevin</b> (linked above, same artist that made the
          background image). A big warm welcome to whoever got here from Google! I've
          worked to get this site exposed through Google's Search, and from what I can
          tell exposure and traffic has slowly been building over the past several months.
          Lastly, and as always, please check out the <b>Discord</b> server linked above,
          let me know if you're enjoying the client, how things can be improved, and to
          connect with our community of enthusiasts!
        </p>
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
