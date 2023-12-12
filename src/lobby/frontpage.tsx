import React from 'react';

import { cardImages, cardback } from '../itcgCardImages';

import frontSample from '../images/front-sample.jpg';
import { toCard, toGrid } from './utils';

const baseStyle: React.CSSProperties = {
  margin: '1%',
  display: 'flex',
  flexDirection: 'column',
};

export class ITCGFrontPage extends React.Component {
  intro() {
    const start = toCard({
      title: 'Getting Started',
      body: (
        <>
          If you are new to the game, check out the brief overview on this page, or read
          through the in-depth 'How to Play' guide. To build decks and/or play games
          against others, please log in or sign up for an account.
        </>
      ),
      links: [
        ['/login', <button className="btn-block border-2">Log In</button>],
        ['/signup', <button className="btn-block border-5">Create an Account</button>],
        ['/howtoplay', <button className="btn-block border-6">How to Play Guide</button>],
        ['/cards', <button className="btn-block border-3">List of Cards</button>],
      ],
    });

    const itcg = toCard({
      title: 'MapleStory iTCG',
      body: (
        <>
          Developed by Wizards of the Coast in partnership with Nexon, iTCG is a trading
          card game based on the computer game MapleStory. Two players face off against
          one another to defeat the other by spawning monsters, equipping items, and
          utilizing tactics and abilities from within the MapleStory game.
        </>
      ),
      image: (
        <div className="align-middle shadow">
          <img src={cardback}></img>
        </div>
      ),
    });

    const character = toCard({
      title: 'Your Character',
      body: (
        <>
          Choose a character from four distinct MapleStory classes to play as. Each
          character comes with their own unique set of abilities and hp (hit points, or
          health) and will battle against your opponent's, leveling up over the course of
          the game to gain more hp and abilities.
        </>
      ),
      image: (
        <div className="align-middle shadow">
          <img src={cardImages['Nixie'].top}></img>
          <img src={cardImages['Nixie'].skill}></img>
          <img src={cardImages['Nixie'].skill2}></img>
          <img src={cardImages['Nixie'].skill3}></img>
        </div>
      ),
    });

    const nonChar = toCard({
      title: 'Dual Purpose',
      body: (
        <>
          Every other card you use will include a level up ability on the bottom in
          addition to the card's effects. During the game, you will choose to either play
          the card for the effect on top, or level up with it to increase your level and
          gain the ability on the bottom. This is a core strategic decision you will have
          to balance through the game because importantly, you can only play cards by
          using abilities!
        </>
      ),
      image: (
        <div className="align-middle shadow">
          <img src={cardImages['MagicClaw'].top}></img>
          <img src={cardImages['MagicClaw'].skill}></img>
        </div>
      ),
    });

    const about = toCard({
      title: 'About maple.rs',
      body: (
        <>
          I've always been obsessed with card games and loved playing MapleStory, so this
          game was the perfect combination of the two. As an aspiring game developer, this
          was a great opportunity to port the game to the web to allow others to play
          without having to install applications or manage game rules on their own. This
          site uses{' '}
          <a target="_blank" ref="noopener noreferrer" href="https://boardgame.io">
            BoardGame IO
          </a>{' '}
          as the framework for the game.
        </>
      ),
    });

    const join = toCard({
      title: 'Join the Community!',
      body: (
        <>
          Join the{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.gg/bSDu2UaJwK"
          >
            Discord server
          </a>{' '}
          to hang out with others collecting and playing the game. Submit issues and bug
          reports there, arrange games with others, or get in contact with me!
        </>
      ),
    });

    return toGrid([start, itcg, character, nonChar, about, join]);
  }

  render() {
    return (
      <div style={baseStyle}>
        <div style={{ textAlign: 'center', marginBottom: '5%' }}>
          <h1 style={{ marginBottom: '0' }}>MapleStory iTCG</h1>
          <p>Web browser application to play the MapleStory trading card game</p>
          <div className="row">
            <img className="border-4" src={frontSample}></img>
          </div>
        </div>
        {this.intro()}
      </div>
    );
  }
}
