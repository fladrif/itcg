import React from 'react';

import { cardImages, cardback } from '../itcgCardImages';

import frontSample from '../images/front-sample.jpg';

const baseStyle: React.CSSProperties = {
  margin: '1%',
  display: 'flex',
  flexDirection: 'column',
};

export class ITCGFrontPage extends React.Component {
  intro() {
    return (
      <>
        <div className="row">
          <img className="border-4" src={frontSample}></img>
        </div>
        <div className="row flex-edges">
          <div className="sm-6 col">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Getting Started</h4>
                <p className="card-text">
                  If you are new to the game, check out the brief overview on this page,
                  or read through the in-depth 'How to Play' guide. To build decks and/or
                  play games against others, please log in or sign up for an account.
                </p>
                <a className="card-link" href="/login">
                  <button className="btn-block border-2">Log In</button>
                </a>
                <a className="card-link" href="/signup">
                  <button className="btn-block border-5">Create an Account</button>
                </a>
                <a className="card-link" href="/howtoplay">
                  <button className="btn-block border-6">How to Play Guide</button>
                </a>
              </div>
            </div>
          </div>
          <div className="sm-6 col">
            <div className="card">
              <div className="align-middle shadow">
                <img src={cardback}></img>
              </div>
              <div className="card-body">
                <h4 className="card-title">MapleStory iTCG</h4>
                <p className="card-text">
                  Developed by Wizards of the Coast in partnership with Nexon, iTCG is a
                  trading card game based on the computer game MapleStory. Two players
                  face off against one another to defeat the other by spawning monsters,
                  equipping items, and utilizing tactics and skills from within the
                  MapleStory game.
                </p>
              </div>
            </div>
          </div>
          <div className="sm-6 col">
            <div className="card">
              <div className="align-middle shadow">
                <img src={cardImages['Nixie'].top}></img>
                <img src={cardImages['Nixie'].skill}></img>
                <img src={cardImages['Nixie'].skill2}></img>
                <img src={cardImages['Nixie'].skill3}></img>
              </div>
              <div className="card-body">
                <h4 className="card-title">Character Cards</h4>
                <p className="card-text">
                  Choose a character to play as before the game begins. Each character has
                  a set of skills and hp (hit points, or health) it starts with. This
                  character will battle against your opponent's and will level up over the
                  course of the game, gaining more hp and skills.
                </p>
              </div>
            </div>
          </div>
          <div className="sm-6 col">
            <div className="card">
              <div className="align-middle shadow">
                <img src={cardImages['MagicClaw'].top}></img>
                <img src={cardImages['MagicClaw'].skill}></img>
              </div>
              <div className="card-body">
                <h4 className="card-title">Dual Purpose</h4>
                <p className="card-text">
                  Every other card you play will include a level up skill on the bottom in
                  addition to the card's effects. During the game, you will choose to
                  either play the card for the effect on top, or level up with it to
                  increase your level and gain the skill on the bottom. This is a core
                  strategic decision you will have to balance through the game because
                  importantly, you can only play cards with skills!
                </p>
              </div>
            </div>
          </div>
          <div className="sm-6 col">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">About Maple.rs</h4>
                <p className="card-text">
                  I've always been obsessed with card games and loved playing MapleStory,
                  so this game was the perfect combination of the two. As an aspiring game
                  developer, this was a great opportunity to port the game to the web to
                  allow others to play without having to install applications or manage
                  game rules on their own. This site uses{' '}
                  <a
                    target="_blank"
                    ref="noopener noreferrer"
                    href="https://boardgame.io"
                  >
                    BoardGame IO
                  </a>{' '}
                  as the framework for the game.
                </p>
              </div>
            </div>
          </div>
          <div className="sm-6 col">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Join the Community!</h4>
                <p className="card-text">
                  Join the{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://discord.gg/bSDu2UaJwK"
                  >
                    Discord server
                  </a>{' '}
                  to hang out with others collecting and playing the game. Submit issues
                  and bug reports there, arrange games with others, or get in contact with
                  me!
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  render() {
    return (
      <div style={baseStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '0' }}>MapleStory iTCG</h1>
        <p style={{ textAlign: 'center' }}>
          Web browser application to play the MapleStory trading card game
        </p>
        {this.intro()}
      </div>
    );
  }
}
