import React from 'react';
import { ParagraphStyle } from './overall.css';

const baseStyle: React.CSSProperties = {
  margin: '1%',
  display: 'flex',
  flexDirection: 'column',
};

export class ITCGHowToPlay extends React.Component {
  overview() {
    return (
      <>
        <h2>How to Play</h2>
        <h3>Overview</h3>
        <p style={ParagraphStyle}>
          Maplestory iTCG is a card game played between two players, with the main goal to
          reduce the opponent's hit points (hp) to 0. Each player will start with a{' '}
          <b>Character</b> that will level up with activatable skills, and a deck of{' '}
          <b>Monster</b>, <b>Item</b>, and <b>Tactic</b> cards.
        </p>
        <p style={ParagraphStyle}>
          The <b>Character</b> card starts the game face up on the player's right, and
          will increase in level and gain skills as the game progresses. The skills of the
          character will allow players to spawn <b>Monster</b>, equip <b>Item</b>, and
          think fast to execute <b>Tactic</b> cards.
        </p>
        <p style={ParagraphStyle}>
          <b>Monster</b> cards in play on the <i>field</i> can be used to attack your
          opponent's <b>Character</b> or other <b>Monster</b> cards. Equipped <b>Item</b>{' '}
          cards exists on the <i>field</i>, and can buff damage, protect monsters and
          characters, and other various effects. <b>Tactic</b> cards have a one time
          effect that occurs when they're played, ranging from dealing damage, destroying
          items and monsters, to gaining health and drawing cards. They do not enter the{' '}
          <i>field</i> but instead go to the <i>discard</i> pile after being played.
        </p>
        <p style={ParagraphStyle}>
          Non-<b>Character</b> cards each have two parts to them, a played upper portion,
          and a lower level-up section. When a non-<b>Character</b> card is played with a{' '}
          <b>Character</b> skill, the lower level-up portion is ignored, and only the
          upper played section is utilized. Alternately when a non-<b>Character</b> card
          is used to level-up, only the bottom portion is utilized, and the top portion
          hidden beneath the <b>Character</b> card.
        </p>
        <p style={ParagraphStyle}>
          All cards (as of this writing and release) belong to 4 different classes and are
          denoted by the associated color: <b>Thief</b> (black), <b>Warrior</b> (blue),{' '}
          <b>Bowman</b> (green), and <b>Magician</b> (red). Playing cards of a certain
          class will require the player to have that same class in their <i>party</i>, ie.
          have their <b>Character</b> be that class, or have leveled up with a card of
          that class.
        </p>
      </>
    );
  }

  partsOfTurn() {
    return (
      <>
        <h3>Parts of the Turn</h3>
        <p style={ParagraphStyle}>
          There are three phases to each turn, the <b>Level</b> phase, <b>Activate</b>{' '}
          phase, and <b>Attack</b> phase, in this exact order. If you have no available
          actions for any particular phase, it will be automatically skipped for you.
          Otherwise you can click on the relevant button to skip that phase. Phases will
          be displayed for both players to the right of their health bar, and the current
          phase will be bolded in yellow.
        </p>
        <div className="row flex-spaces tabs">
          <input id="tab1" type="radio" name="tabs" defaultChecked />
          <label htmlFor="tab1">Level</label>

          <input id="tab2" type="radio" name="tabs" />
          <label htmlFor="tab2">Activate</label>

          <input id="tab3" type="radio" name="tabs" />
          <label htmlFor="tab3">Attack</label>

          <div className="content" id="content1">
            <h4>Level</h4>
            <p style={ParagraphStyle}>
              During the <b>Level</b> phase, the player will have the opportunity to level
              up with a card from their hand. These non-<b>Character</b> cards in the hand
              will have a lower level-up section that contains a skill that the character
              will gain. In addition to the skill, the character will also gain 20 hp (hit
              points) and 10 levels. This health gain can increase beyond the starting
              life total of the character, so it will be common to see characters with hp
              higher than their base (ie. <b>260</b>/180 hp).
            </p>
            <p style={ParagraphStyle}>
              <i>Oneshot</i> skills (skills with a lighting bolt icon instead of a level
              and class requirement) are activated here. They are activated immediately
              after the card is used to level up, and only once during the game at this
              time.
            </p>
            <p style={ParagraphStyle}>
              <b>Play Tip:</b> When in the <b>Level</b> phase, click on a card in your
              hand to level up with it. Click on the <i>Do not Level</i> button if you
              want to skip to the <b>Activate</b> phase.
            </p>
          </div>
          <div className="content" id="content2">
            <h4>Activate</h4>
            <p style={ParagraphStyle}>
              The <b>Activate</b> phase allows the player to utilize the skills learned by
              their character. Skills <b>MUST</b> be used in order, from top to bottom.
              Players can skip skills that they do not meet the requirement for, or
              otherwise choose not to use. Skills skipped this way cannot be activated
              later on that turn.
            </p>
            <p style={ParagraphStyle}>
              Skills will often have requirements listed in the box to the left,
              indicating the level requirement of the <b>Character</b>, and a number of
              colored pips, corresponding to class requirements. The class requirements
              are met by leveling up with at least that number of cards of that class. For
              example, a skill of 70 and 2 red pips will require the character to be at
              least level 70, and having leveled up with at least 2 <b>Magician</b> cards.
            </p>
            <p style={ParagraphStyle}>
              Skills with a lighting bolt instead of a level requirement are{' '}
              <i>oneshot</i> skills. You can read about these in the previous <b>Level</b>{' '}
              phase.{' '}
            </p>
            <p style={ParagraphStyle}>
              <b>Play Tip:</b> When in the <b>Activate</b> phase, click on the{' '}
              <b>Character</b> skill you wish to activate. Skills will be shaded if your
              character doesn't meet the requirements, or if they've been already
              activated or skipped. Click on the <i>Go to Attack Stage</i> button if you
              are done activating skills.
            </p>
          </div>
          <div className="content" id="content3">
            <h4>Attack</h4>
            <p style={ParagraphStyle}>
              The <b>Attack</b> phase is the last phase of a player's turn, and the time
              when spawned <b>Monster</b> cards are able to attack. Each <b>Monster</b>{' '}
              can typically attack the turn they're played (unless they have a keyword or
              effect that says otherwise), and will attack only once (unless otherwise
              stated). They can attack either your opponent's <b>Monster</b> cards, or
              their <b>Character</b>. Attacking your opponent's <b>Monster</b> cards will
              only deal damage to the opposing <b>Monster</b> without taking damage
              itself. Damage to <b>Monster</b> cards, if not enough to destroy them, will
              be removed after the turn ends. Attacks to <b>Character</b> cards will be{' '}
              <i>shield</i>ed (explained below).
            </p>
            <p style={ParagraphStyle}>
              <b>Play Tip:</b> When in the <b>Attack</b> phase, click on the{' '}
              <b>Monster</b> you wish to attack with, then the <b>Monster</b> or{' '}
              <b>Character</b> you wish to attack with that <b>Monster</b>. <b>Monster</b>
              s that cannot attack, or have already attacked will be shaded. Click on{' '}
              <i>Pass Turn</i> if you do not want to attack with any other <b>Monster</b>{' '}
              cards, and to pass the turn to your opponent.
            </p>
          </div>
        </div>
      </>
    );
  }

  shield() {
    return (
      <>
        <h3>Shield</h3>
        <p style={ParagraphStyle}>
          <b>Character</b> cards are inherently <i>shield</i>ed from damage by their{' '}
          <b>Monster</b> cards and effects with <i>shield</i>. <i>Shield</i> prevents 10
          damage to a <b>Character</b> for each <b>Monster</b> that player controls, and
          applies to each damage source. For example, if a player controls 1{' '}
          <b>Monster</b>, a 20 damage <b>Tactic</b> will only deal 10 damage to the{' '}
          <b>Character</b>, and a <b>Monster</b> with 10 attack will deal 0 damage.{' '}
          <b>Monster</b> cards that <i>shield</i> the <b>Character</b> do not take damage
          themeselves when <i>shield</i>ing.
        </p>
      </>
    );
  }

  endGame() {
    return (
      <>
        <h3>End of Game</h3>
        <p style={ParagraphStyle}>
          The game ends when one player is at 0 hit points (hp). When a player runs out of
          cards in their deck, they don't lose like in other games, the player just loses
          the ability to draw further cards.
        </p>
      </>
    );
  }

  render() {
    return (
      <div style={baseStyle}>
        {this.overview()}
        ----------------------------------------------------------
        {this.partsOfTurn()}
        ----------------------------------------------------------
        {this.shield()}
        ----------------------------------------------------------
        {this.endGame()}
      </div>
    );
  }
}
