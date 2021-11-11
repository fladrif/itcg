import React from 'react';

const baseStyle: React.CSSProperties = {
  marginTop: '1%',
  display: 'flex',
  flexDirection: 'column',
  width: '60vw',
};

const paragraphStyle: React.CSSProperties = {
  textIndent: '5%',
  lineHeight: '175%',
};

export class ITCGHowToPlay extends React.Component {
  overview() {
    return (
      <>
        <h2>Overview</h2>
        <p style={paragraphStyle}>
          Maplestory iTCG is a card game played between two players, with the main goal to
          reduce the opponent's hit points (hp) to 0. Each player will start with a{' '}
          <b>Character</b> that will level up with activatable skills, and a deck of{' '}
          <b>Monsters</b>, <b>Items</b>, and <b>Tactics</b>.
        </p>
        <p style={paragraphStyle}>
          The <b>Character</b> card starts the game face up on the player's right, and
          will increase in level and gain skills as the game progresses. The skills of the
          character will allow players to spawn <b>Monster</b>s, equip <b>Item</b>s, and
          think fast to execute <b>Tactic</b>s.
        </p>
        <p style={paragraphStyle}>
          <b>Monster</b>s in play on the <i>field</i> can be used to attack your
          opponent's <b>Character</b> or other <b>Monster</b>s. Equipped <b>Item</b>s
          exists on the <i>field</i>, and can buff damage, protect monsters and
          characters, and other various effects. <b>Tactic</b>s have a one time effect
          that occurs when they're played, ranging from dealing damage, destroying items
          and monsters, to gaining health and drawing cards. They do not enter the{' '}
          <i>field</i> but instead go to the <i>discard</i> pile after being played.
        </p>
        <p style={paragraphStyle}>
          Non<b>Character</b> cards each have two parts to them, a played upper portion,
          and a lower level-up section. When a non<b>Character</b> card is played with a{' '}
          <b>Character</b> skill, the lower level-up portion is ignored, and only the
          upper played section is utilized. Alternately when a non<b>Character</b> card is
          used to level-up, only the bottom portion is utilized, and the top portion
          hidden beneath the <b>Character</b> card.
        </p>
        <p style={paragraphStyle}>
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
        <h2>Parts of the Turn</h2>
        <p style={paragraphStyle}>
          There are three phases to each turn, the <b>Level</b> phase, <b>Activate</b>{' '}
          phase, and <b>Attack</b> phase, in this exact order.
        </p>
        <h3>Level</h3>
        <p style={paragraphStyle}>
          During the <b>Level</b> phase, the player will have the opportunity to level up
          with a card from their hand. These non<b>Character</b> cards in the hand will
          have a lower level-up section that contains a skill that the character will
          gain. In addition to the skill, the character will also gain 20 hp (hit points)
          and 10 levels. This health gain can increase beyond the starting life total of
          the character, so it will be common to see characters with hp higher than their
          base (ie. <b>260</b>/180 hp).
        </p>
        <p style={paragraphStyle}>
          <i>Oneshot</i> skills are also activated here. You can read about those further
          down in the <b>Activate</b> phase.
        </p>
        <p style={paragraphStyle}>
          <b>Play Tip:</b> When in the <b>Level</b> phase, click on a card in your hand to
          level up with it.
        </p>
        <h3>Activate</h3>
        <p style={paragraphStyle}>
          The <b>Activate</b> phase allows the player to utilize the skills learned by
          their character. Skills <b>MUST</b> be used in order, from top to bottom.
          Players can skip skills that they do not meet the requirement for, or otherwise
          choose not to use. Skills skipped this way cannot be activated later on that
          turn.
        </p>
        <p style={paragraphStyle}>
          Skills will often have requirements listed in the box to the left, indicating
          the level requirement of the <b>Character</b>, and a number of colored pips,
          corresponding to class requirements. The class requirements are met by leveling
          up with at least that number of cards of that class. For example, a skill of 70
          and 2 red pips will require the character to be at least level 70, and having
          leveled up with at least 2 <b>Magician</b> cards.
        </p>
        <p style={paragraphStyle}>
          Skills without a level requirement but instead with a lightning bolt is a{' '}
          <i>oneshot</i> skill. These skills are activated immediately when the card is
          used to level up, and will only activate once during the game at that time.
        </p>
        <p style={paragraphStyle}>
          <b>Play Tip:</b> When in the <b>Activate</b> phase, click on the{' '}
          <b>Character</b> skill you wish to activate. Skills will be shaded if your
          character doesn't meet the requirements, or if they've been activated already or
          skipped.
        </p>
        <h3>Attack</h3>
        <p style={paragraphStyle}>
          The <b>Attack</b> phase is the last phase of a player's turn, and the time when
          spawned <b>Monster</b>s are able to attack. Each <b>Monster</b> can typically
          attack the turn they're played (unless they have a keyword or effect that says
          otherwise), and will attack only once (unless otherwise stated). They can attack
          either your opponent's <b>Monster</b>s, or their <b>Character</b>. Attacking
          your opponent's <b>Monster</b>s will only deal damage to the opposing{' '}
          <b>Monster</b> without taking damage itself. Damage to <b>Monster</b>s, if not
          enough to destroy them, will be removed after the turn ends. Attacks to{' '}
          <b>Character</b>s will be <i>shield</i>ed (explained below).
        </p>
        <p style={paragraphStyle}>
          <b>Play Tip:</b> When in the <b>Attack</b> phase, click on the <b>Monster</b>{' '}
          you wish to attack with, then the <b>Monster</b> or <b>Character</b> you wish to
          attack with that <b>Monster</b>. <b>Monster</b>s that cannot attack, or have
          already attacked will be shaded.
        </p>
      </>
    );
  }

  shield() {
    return (
      <>
        <h2>Shield</h2>
        <p style={paragraphStyle}>
          <b>Character</b>'s are inherently <i>shield</i>ed from damage by their{' '}
          <b>Monster</b>s and other effects with <i>shield</i>. <i>Shield</i> prevents 10
          damage to a character for each <b>Monster</b> that player controls from each
          damage source. For example, if a player controls 1 <b>Monster</b>, a 20 damage{' '}
          <b>Tactic</b> will only deal 10 damage to the <b>Character</b>, and a{' '}
          <b>Monster</b> with 10 attack will deal 0 damage. The <b>Monster</b> controlled
          by the player will not take damage when the <b>Character</b> is <i>shield</i>
          ed from damage.
        </p>
      </>
    );
  }

  render() {
    return (
      <div style={baseStyle}>
        {this.overview()}
        {this.partsOfTurn()}
        {this.shield()}
      </div>
    );
  }
}
