import React from 'react';

import { cardImages } from '../itcgCardImages';
import { BLANK_CARDNAME, CardClasses, CardTypes } from '../card';
import { cards } from '../cards';

import { toCard, toGrid } from './utils';

const baseStyle: React.CSSProperties = {
  margin: '1%',
  display: 'flex',
  flexDirection: 'column',
};

export class ITCGCards extends React.Component {
  charImage(name: keyof typeof cardImages) {
    return (
      <div className="align-middle shadow">
        <img src={cardImages[name].top}></img>
        <img src={cardImages[name].skill}></img>
        <img src={cardImages[name].skill2}></img>
        <img src={cardImages[name].skill3}></img>
      </div>
    );
  }

  nonCharImage(name: keyof typeof cardImages) {
    return (
      <div className="align-middle shadow">
        <img src={cardImages[name].top}></img>
        <img src={cardImages[name].skill}></img>
      </div>
    );
  }

  green() {
    const charCards = Object.values(cards).filter(
      (card) => card.type === CardTypes.Character && card.class === CardClasses.Bowman
    );

    const nonCharCards = Object.values(cards).filter(
      (card) => card.type !== CardTypes.Character && card.class === CardClasses.Bowman
    );

    return toGrid(
      [
        ...charCards.map((card) =>
          toCard({
            title: '',
            body: card.name,
            image: this.charImage(card.image),
          })
        ),
        ...nonCharCards.map((card) =>
          toCard({
            title: '',
            body: card.name,
            image: this.charImage(card.image),
          })
        ),
      ],
      'small'
    );
  }

  red() {
    const charCards = Object.values(cards).filter(
      (card) => card.type === CardTypes.Character && card.class === CardClasses.Magician
    );

    const nonCharCards = Object.values(cards).filter(
      (card) =>
        card.type !== CardTypes.Character &&
        card.class === CardClasses.Magician &&
        card.name !== BLANK_CARDNAME
    );

    return toGrid(
      [
        ...charCards.map((card) =>
          toCard({
            title: '',
            body: card.name,
            image: this.charImage(card.image),
          })
        ),
        ...nonCharCards.map((card) =>
          toCard({
            title: '',
            body: card.name,
            image: this.charImage(card.image),
          })
        ),
      ],
      'small'
    );
  }

  black() {
    const charCards = Object.values(cards).filter(
      (card) => card.type === CardTypes.Character && card.class === CardClasses.Thief
    );

    const nonCharCards = Object.values(cards).filter(
      (card) => card.type !== CardTypes.Character && card.class === CardClasses.Thief
    );

    return toGrid(
      [
        ...charCards.map((card) =>
          toCard({
            title: '',
            body: card.name,
            image: this.charImage(card.image),
          })
        ),
        ...nonCharCards.map((card) =>
          toCard({
            title: '',
            body: card.name,
            image: this.charImage(card.image),
          })
        ),
      ],
      'small'
    );
  }

  blue() {
    const charCards = Object.values(cards).filter(
      (card) => card.type === CardTypes.Character && card.class === CardClasses.Warrior
    );

    const nonCharCards = Object.values(cards).filter(
      (card) => card.type !== CardTypes.Character && card.class === CardClasses.Warrior
    );

    return toGrid(
      [
        ...charCards.map((card) =>
          toCard({
            title: '',
            body: card.name,
            image: this.charImage(card.image),
          })
        ),
        ...nonCharCards.map((card) =>
          toCard({
            title: '',
            body: card.name,
            image: this.charImage(card.image),
          })
        ),
      ],
      'small'
    );
  }

  render() {
    return (
      <div style={baseStyle}>
        <h2>Cards</h2>
        <p>
          List of cards currently available in the game. More cards to be added in the
          future
        </p>
        <h3 className="margin-none">
          <span className="badge primary">Set 1</span>
        </h3>
        <div className="border border-4 border-dashed margin-bottom padding">
          <h4 className="margin-none padding-top">
            <span className="badge success">Bowman</span>
          </h4>
          <div className="border border-dotted margin-bottom padding">{this.green()}</div>
          <h4 className="margin-none padding-top">
            <span className="badge danger">Magician</span>
          </h4>
          <div className="border border-dotted margin-bottom padding">{this.red()}</div>
          <h4 className="margin-none padding-top">
            <span className="badge primary">Thief</span>
          </h4>
          <div className="border border-dotted margin-bottom padding">{this.black()}</div>
          <h4 className="margin-none padding-top">
            <span className="badge secondary">Warrior</span>
          </h4>
          <div className="border border-dotted margin-bottom padding">{this.blue()}</div>
        </div>
      </div>
    );
  }
}
