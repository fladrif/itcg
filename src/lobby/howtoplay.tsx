import React from 'react';

import { cardImages } from '../itcgCardImages';
import inactiveImg from '../images/phase-inactive.png';
import levelImg from '../images/phase-level.png';
import activateImg from '../images/phase-activate.png';
import attackImg from '../images/phase-attack.png';

import { toCard, toGrid } from './utils';

const baseStyle: React.CSSProperties = {
  margin: '1%',
  display: 'flex',
  flexDirection: 'column',
};

export class ITCGHowToPlay extends React.Component {
  basics() {
    const howToWin = toCard({
      title: 'How to Win',
      body: (
        <>
          <p>
            Win by reducing your opponent's hit points (hp) to 0. Running out of cards in
            your deck does not cause you to lose.
          </p>
          <p>
            Do this by leveling up your Character with cards in your hand. Higher levels
            give you access to abilities that spawn monsters to fight for you, equip armor
            and weapons, and deal damage to your opponent and their monsters directly.
          </p>
        </>
      ),
    });

    // TODO: include image of a deck list / page
    const deck = toCard({
      title: 'Creating a Deck',
      body: (
        <>
          <p>
            After logging in, create your own deck from the deck tab. It will display the
            contents of private and public decks. Public decks can be seen and used by
            anyone, but cannot be edited. Private decks are those you create yourself and
            can only be viewed by you.
          </p>
          <p>
            Each deck must contain a <b>Character</b> card and a minimum of 40 non-
            <b>Character</b> cards (<b>Monster</b>s, <b>Item</b>s, and <b>Tactic</b>s),
            but no more than 4 copies of any one card.
          </p>
        </>
      ),
    });
    // TODO: include image of a table or room
    const setup = toCard({
      title: 'Getting into a Game',
      body: (
        <>
          On the main page after you've logged in, you will see the option to either join
          a table or open one yourself. Once on a table select a deck to play and click on
          the <kbd>Ready</kbd> button to lock it in. The game will immediately start once
          both players lock in their choices.
        </>
      ),
    });

    const start = toCard({
      title: 'Starting a Game',
      body: (
        <>
          Each player starts with their <b>Character</b> on the playing field to their
          right. Starting hp is determined by the <b>Character</b> chosen. The player
          going first will be randomly selected and starts the game with 5 cards drawn
          from their deck. The player going second will start with 6 cards.
        </>
      ),
    });

    return (
      <>
        <h3>Basics</h3>
        {toGrid([howToWin, deck, setup, start])}
      </>
    );
  }

  types() {
    const characterType = toCard({
      title: 'Character',
      body: (
        <>
          <b>Character</b>s are the foundation of the game. Each player starts with one in
          play that determines your starting hp and abilities. Level up your{' '}
          <b>Character</b> to gain new abilities, and enable you to use ones you've
          already acquired.
        </>
      ),
      image: (
        <div className="align-middle shadow">
          <img src={cardImages['Skyhawk'].top}></img>
          <img src={cardImages['Skyhawk'].skill}></img>
          <img src={cardImages['Skyhawk'].skill2}></img>
          <img src={cardImages['Skyhawk'].skill3}></img>
        </div>
      ),
    });

    const itemType = toCard({
      title: 'Item',
      body: (
        <>
          <b>Item</b>s are played onto the field and stay there until destroyed. They
          typically have a continuous effect while they remain in play that can boost
          damage, buff your <b>Character</b>, or draw cards.
        </>
      ),
      image: (
        <div className="align-middle shadow">
          <img src={cardImages['BloodSlain'].top}></img>
          <img src={cardImages['BloodSlain'].skill}></img>
        </div>
      ),
    });

    const tacticType = toCard({
      title: 'Tactic',
      body: (
        <>
          <b>Tactic</b>s have a one time effect that occurs immediately when played. They
          do not enter the playing field, but will go to the discard pile after resolving.
        </>
      ),
      image: (
        <div className="align-middle shadow">
          <img src={cardImages['ThunderBolt'].top}></img>
          <img src={cardImages['ThunderBolt'].skill}></img>
        </div>
      ),
    });

    const monsterType = toCard({
      title: 'Monster',
      body: (
        <>
          <b>Monster</b>s are one of the more important aspects of the game. They stay on
          the field when played and can attack either your opponent's <b>Character</b> or
          their <b>Monster</b>s. While in play they also <a href="#dmg">defend</a> your{' '}
          <b>Character</b>.
        </>
      ),
      image: (
        <div className="align-middle shadow">
          <img src={cardImages['YetiPepe'].top}></img>
          <img src={cardImages['YetiPepe'].skill}></img>
        </div>
      ),
    });

    return (
      <>
        <h3>Card Types</h3>
        {toGrid([characterType, itemType, tacticType, monsterType])}
      </>
    );
  }

  cards() {
    const draw = toCard({
      title: 'Drawing Cards',
      body: (
        <>
          <p>
            Players do <b>NOT</b> automatically draw a card at the start of their turn.
            Instead drawing a card requires an ability that all <b>Characters</b> have,{' '}
            <span className="badge">Quest</span>. Non-<b>Character</b> cards also have
            ways to draw cards.
          </p>
          <p>
            In the example above, your <b>Character</b> must be level 20 in order to draw
            a card.
          </p>
        </>
      ),
      image: (
        <div className="align-middle shadow margin-top">
          <img src={cardImages['Mistmoon'].skill2}></img>
        </div>
      ),
    });

    const classes = toCard({
      title: 'Card Classes & Restrictions',
      body: (
        <>
          <p>
            There are 4 classes in MapleStory iTCG, <b>Warrior</b> (blue), <b>Magician</b>{' '}
            (red), <b>Thief</b>
            (black), and <b>Bowman</b> (green).
          </p>
          <p>
            To play a card of a specific class, you must have leveled up with that class
            already. For example, playing a <b>Thief</b> card will require you to have
            leveled up with another <b>Thief</b> card.
          </p>
          <p>
            <strong>Note:</strong> Your <b>Character</b> does not count towards classes
            you can play. If your <b>Character</b> is a <b>Thief</b>, you will still need
            to have leveled up with another <b>Thief</b> card to play one.
          </p>
        </>
      ),
      image: (
        <div className="row margin-top shadow">
          <div className="col col-3 padding-none">
            <img src={cardImages['Sherman'].top}></img>
            <img src={cardImages['Sherman'].skill}></img>
            <img src={cardImages['Sherman'].skill2}></img>
            <img src={cardImages['Sherman'].skill3}></img>
          </div>
          <div className="col col-3 padding-none">
            <img src={cardImages['Maya'].top}></img>
            <img src={cardImages['Maya'].skill}></img>
            <img src={cardImages['Maya'].skill2}></img>
            <img src={cardImages['Maya'].skill3}></img>
          </div>
          <div className="col col-3 padding-none">
            <img src={cardImages['Ivan'].top}></img>
            <img src={cardImages['Ivan'].skill}></img>
            <img src={cardImages['Ivan'].skill2}></img>
            <img src={cardImages['Ivan'].skill3}></img>
          </div>
          <div className="col col-3 padding-none">
            <img src={cardImages['Nixie'].top}></img>
            <img src={cardImages['Nixie'].skill}></img>
            <img src={cardImages['Nixie'].skill2}></img>
            <img src={cardImages['Nixie'].skill3}></img>
          </div>
        </div>
      ),
    });

    const playItem = toCard({
      title: 'Playing Items',
      body: (
        <>
          <p>
            To play <b>Item</b> cards, you will need the <b>Character</b> ability{' '}
            <span className="badge">Equip</span>, and the required level and classes in
            order to use it. <span className="badge">Equip</span> will also indicate what
            level of <b>Item</b> you can play with it.
          </p>
          <p>
            In the example above, your <b>Character</b> must be level 30 and have leveled
            up a <b>Warrior</b> card to use the <span className="badge">Equip 30</span>{' '}
            ability to play an <b>Item</b> of level 30 or less.
          </p>
        </>
      ),
      image: (
        <div className="align-middle shadow margin-top">
          <img src={cardImages['TheNineDragons'].skill}></img>
        </div>
      ),
    });

    const playTactic = toCard({
      title: 'Playing Tactics',
      body: (
        <>
          <p>
            Like <b>Item</b>s, <b>Tactic</b>s require a specific ability to be played, in
            their case <span className="badge">Think Fast</span>.
          </p>
          <p>
            Some abilities scale the level of cards they allow you to play with your{' '}
            <b>Character</b>'s level and are denoted with <span className="badge">X</span>{' '}
            instead of a level maximum for the card.{' '}
          </p>
          <p>
            In the example above, your <b>Character</b> must be level 40 and have leveled
            up with 3 <b>Magician</b> cards to use the{' '}
            <span className="badge">Think Fast X</span> ability to play a <b>Tactic</b> of
            your <b>Character</b>'s level or less
          </p>
        </>
      ),
      image: (
        <div className="align-middle shadow margin-top">
          <img src={cardImages['KnowledgeIsPower'].skill}></img>
        </div>
      ),
    });

    const playMonster = toCard({
      title: 'Playing Monsters',
      body: (
        <>
          <p>
            <b>Monster</b> cards are played with the <span className="badge">Spawn</span>{' '}
            ability.
          </p>
          <p>
            Some abilities will allow you to play multiple types of cards and will list
            them together with a <span className="badge">/</span> and a maximum level.
            Activating these will allow you to play either type of card.
          </p>
          <p>
            In the example above, your <b>Character</b> must be level 40 and have leveled
            up with 2 <b>Bowman</b> cards to use the{' '}
            <span className="badge">Spawn/Equip 30</span> ability to play a <b>Monster</b>{' '}
            or <b>Item</b> of level 30 or less.
          </p>
        </>
      ),
      image: (
        <div className="align-middle shadow margin-top">
          <img src={cardImages['HornedMushroom'].skill}></img>
        </div>
      ),
    });

    const playExample = toCard({
      title: 'Example',
      body: (
        <>
          <p>
            Play the level 12 Octopus <b>Magician</b> <b>Monster</b> card with a level 30
            Sherman.
          </p>
          <p>
            Use Sherman's <span className="badge">Spawn X</span> ability. It requires
            Sherman to be at least level 30 and have leveled up with 2 <b>Warrior</b>{' '}
            cards. It will allow you to play <b>Monster</b> cards of Sherman's level or
            less.
          </p>
          <p>
            Since Octopus is a <b>Magician</b> card, you will also need to have leveled up
            with a <b>Magician</b> card in order to play it.
          </p>
        </>
      ),
      image: (
        <div className="row margin-top">
          <div className="col col-6 padding-none">
            <img src={cardImages['Octopus'].top}></img>
            <img src={cardImages['Octopus'].skill}></img>
          </div>
          <div className="col col-6 padding-none">
            <img src={cardImages['Sherman'].top}></img>
            <img src={cardImages['Sherman'].skill}></img>
            <img src={cardImages['Sherman'].skill2}></img>
            <img src={cardImages['Sherman'].skill3}></img>
            <img src={cardImages['BattleShield'].skill}></img>
            <img src={cardImages['RedApprenticeHat'].skill}></img>
            <img src={cardImages['Slime'].skill}></img>
          </div>
        </div>
      ),
    });

    return (
      <>
        <h3>Drawing & Playing Cards</h3>
        {toGrid([draw, playItem, playTactic, playMonster, classes, playExample])}
      </>
    );
  }

  partsOfCard() {
    const top = toCard({
      title: 'Play the Top',
      body: (
        <>
          <p>
            The top part of the card is relevant only when played. The level and type of
            the card in this portion will determine how it can be played. Ignore the
            bottom section of the card when a card is played this way.
          </p>
          <p>
            For <b>Monster</b> cards, their attack power and health are also included in
            this section. Its attack is the first number in blue, and their health is the
            second number in red.
          </p>
          <p>
            Additional rules text for the card will be located in the box below the art.
          </p>
        </>
      ),
      image: (
        <div className="align-middle shadow">
          <img src={cardImages['OrangeMushroom'].top}></img>
        </div>
      ),
    });

    const skill = toCard({
      title: 'Level up with the Bottom',
      body: (
        <>
          <p>
            The bottom section of the card is relevant when it is used to level up. When
            done so the top section is placed beneath the rest of the cards used to level
            up your <b>Character</b> and subsequently ignored.
          </p>
          <p>
            This section includes the <b>Class</b> of the card, a symbol indicating that
            the <b>Character</b> level has increased by 10, and the ability the{' '}
            <b>Character</b> gains.
          </p>
        </>
      ),
      image: (
        <div className="align-middle shadow margin-top">
          <img src={cardImages['OrangeMushroom'].skill}></img>
        </div>
      ),
    });

    const oneshot = toCard({
      title: 'One-shot Abilities',
      body: (
        <>
          <i>One-shot</i> abilities are a variation of <b>Character</b> abilities; they
          are denoted with the lightning bolt icon. Its effect has no requirements and is
          activated immediately after it is used to level up, and only once for the rest
          of the game.
        </>
      ),
      image: (
        <div className="align-middle shadow margin-top">
          <img src={cardImages['BattleBow'].skill}></img>
        </div>
      ),
    });

    const skillCol = (
      <div className="row margin-none">
        <div className="col col-12 padding-none margin-bottom">{skill}</div>
        <div className="col col-12 padding-none margin-top">{oneshot}</div>
      </div>
    );

    return (
      <>
        <h3>Parts of a Card</h3>
        {toGrid([top, skillCol])}
      </>
    );
  }

  partsOfTurn() {
    const overview = toCard({
      title: 'Phases',
      body: (
        <>
          <p>
            There are three phases to each turn, <b>Level</b>, <b>Activate</b>, and{' '}
            <b>Attack</b>.
          </p>
          <p>
            Phases will be displayed for both players to the right of their health bar,
            and the current phase will be bolded in yellow on that player's indicator. If
            no phases are highlighted on a player's indicator, it isn't that player's
            turn.
          </p>
        </>
      ),
      image: (
        <div className="align-middle shadow margin-top">
          <img src={inactiveImg}></img>
        </div>
      ),
    });

    const level = toCard({
      title: 'Level',
      body: (
        <>
          <p>
            During the <b>Level</b> phase, the player has the opportunity to level up with
            a card from their hand. When leveling up, the chosen card will be placed under
            the <b>Character</b> with only the new ability showing, and will gain 20 hp
            (hit points) and 10 levels. This health gain can increase beyond the starting
            life total of the character, so it will be common to see characters with hp
            higher than their base (ie. <b>260</b>/180 hp).
          </p>
          <div className="border border-dotted margin-bottom padding">
            <a href="#part">One-shot</a> abilities are activated during this phase.
          </div>
          <p>
            <b>In Game:</b> During the <b>Level</b> phase, click on a card in your hand to
            level up with it. Click on the <kbd>Do not Level</kbd> button if you want to
            skip to the <b>Activate</b> phase.
          </p>
        </>
      ),
      image: (
        <div className="align-middle shadow margin-top">
          <img src={levelImg}></img>
        </div>
      ),
    });

    const activate = toCard({
      title: 'Activate',
      body: (
        <>
          <p>
            The <b>Activate</b> phase allows the player to utilize the abilities learned
            by their character. Abilities can only be used in order from top to bottom,
            but can skip abilities if they choose. If a player does not meet the
            requirement for an ability or chooses not to use it, they cannot be activated
            later on that turn.
          </p>
          <div className="border border-dotted margin-bottom padding">
            <a href="#part">One-shot</a> abilities cannot be activated here, only during
            the <b>Level</b> phase.
          </div>
          <p>
            <b>In Game:</b> During the <b>Activate</b> phase, click on the{' '}
            <b>Character</b> ability you wish to activate. Abilities will be shaded if
            your character doesn't meet the requirements, or if they've been already
            activated or skipped. Click on the <kbd>Go to Attack Stage</kbd> button if you
            are done activating abilities.
          </p>
        </>
      ),
      image: (
        <div className="align-middle shadow margin-top">
          <img src={activateImg}></img>
        </div>
      ),
    });

    const attack = toCard({
      title: 'Attack',
      body: (
        <>
          <p>
            The <b>Attack</b> phase is the last phase of a player's turn, and the time
            when spawned <b>Monster</b> cards are able to attack. Each <b>Monster</b> can
            typically attack the turn they're played (unless they have a keyword or effect
            that says otherwise), and will attack only once (unless otherwise stated).
            They can attack either your opponent's <b>Monster</b> cards, or their{' '}
            <b>Character</b>.
          </p>
          <p>
            <b>In Game:</b> During the <b>Attack</b> phase, click on the <b>Monster</b>{' '}
            you wish to attack with, then the <b>Monster</b> or <b>Character</b> you wish
            to attack. <b>Monster</b>s that cannot attack, or have already attacked will
            be shaded. Click on <kbd>Pass Turn</kbd> if you do not want to attack with any
            other <b>Monster</b>s, or to pass the turn to your opponent.
          </p>
        </>
      ),
      image: (
        <div className="align-middle shadow margin-top">
          <img src={attackImg}></img>
        </div>
      ),
    });

    return (
      <>
        <h3>Parts of the Turn</h3>
        <div className="row flex-edges">
          <div className="sm-12 col">{overview}</div>
          <div className="sm-12 col">{level}</div>
          <div className="sm-12 col">{activate}</div>
          <div className="sm-12 col">{attack}</div>
        </div>
      </>
    );
  }

  damage() {
    const mvm = toCard({
      title: 'Monster vs Monster',
      body: (
        <>
          When attacking, only the attacking <b>Monster</b> will deal damage while the
          opposing <b>Monster</b> will not. The damage dealt is equal to its attack power,
          the top number in blue.
        </>
      ),
    });

    const dtm = toCard({
      title: 'Damage to Monsters',
      body: (
        <>
          If a <b>Monster</b> is dealt damage equal to its health over the course of a
          turn, it will be destroyed and will go to its owner's discard pile. Damage to{' '}
          <b>Monster</b>s are removed at the end of the turn otherwise.
        </>
      ),
    });

    const dtc = toCard({
      title: 'Damage to Characters',
      body: (
        <>
          <p>
            When a <b>Character</b> is dealt damage, the player will lose that much hp.
          </p>
          <p>
            <i>Shield:</i> <b>Monster</b>s will defend your <b>Character</b> from all
            sources of damage. Each time your <b>Character</b> is dealt damage, you will
            take 10 less damage for each <b>Monster</b> you control. <b>Monster</b>s do
            not take damage when defending.
          </p>
        </>
      ),
    });

    const dexp = toCard({
      title: 'Damage Example',
      body: (
        <>
          <p>
            If a player controls 1 <b>Monster</b>, a 20 damage <b>Tactic</b> will only
            deal 10 damage to the <b>Character</b>, and a <b>Monster</b> with 10 attack
            will deal 0 damage.
          </p>
          <p>
            <b>Strategy:</b> Damage and destroy <b>Monster</b>s first to lower the amount
            of damage <i>shielded</i> from the opponent's <b>Character</b>.
          </p>
        </>
      ),
    });

    return (
      <>
        <h3>Dealing Damage</h3>
        {toGrid([mvm, dtm, dtc, dexp])}
      </>
    );
  }

  render() {
    return (
      <div style={baseStyle}>
        <h2>How to Play</h2>
        <ul>
          <li>
            <a href="#basic">Basics</a>
          </li>
          <li>
            <a href="#type">Card Types</a>
          </li>
          <li>
            <a href="#part">Parts of a Card</a>
          </li>
          <li>
            <a href="#play">Drawing & Playing Cards</a>
          </li>
          <li>
            <a href="#turn">Parts of the Turn</a>
          </li>
          <li>
            <a href="#dmg">Dealing Damage</a>
          </li>
        </ul>
        <div className="container-md" id="basic">
          {this.basics()}
        </div>
        <div className="container-md" id="type">
          {this.types()}
        </div>
        <div className="container-md" id="part">
          {this.partsOfCard()}
        </div>
        <div className="container-md" id="play">
          {this.cards()}
        </div>
        <div className="container-md" id="turn">
          {this.partsOfTurn()}
        </div>
        <div className="container-md" id="dmg">
          {this.damage()}
        </div>
      </div>
    );
  }
}
