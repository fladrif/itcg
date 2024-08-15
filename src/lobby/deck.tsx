import React from 'react';
import axios from 'axios';

import { ITCGDeckBuilder } from './deckBuilder';
import { CardStyle, ParagraphStyle } from './overall.css';

import { Deck } from '../game';

interface DeckProp {
  server: string;
}

export interface DeckMetaData {
  id: string;
  name: string;
  deck_list: Deck;
  modify: boolean;
}

export interface State {
  decks: DeckMetaData[];
  build: boolean;
  buildDeck?: string;
}

const baseStyle: React.CSSProperties = {
  margin: '1%',
  display: 'flex',
  flexDirection: 'column',
};

export class ITCGDeck extends React.Component<DeckProp> {
  state: State;

  constructor(prop: DeckProp) {
    super(prop);
    this.state = { decks: [], build: false };
  }

  async componentDidMount() {
    await this.updateSelf();
  }

  async updateSelf(obj?: Partial<State>) {
    const resp = await axios('/decks', {
      baseURL: this.props.server,
      timeout: 5000,
      withCredentials: true,
    });

    if (!resp.data) return;

    this.setState({ ...obj, decks: resp.data });
  }

  buildDeck(id?: string) {
    this.setState({ build: true, buildDeck: id });
  }

  newDeck() {
    return (
      <div className="sm-3 col">
        <div className="card" key="new" style={CardStyle}>
          <div className="card-body">
            <h2 className="card-title">New Deck</h2>
            <button onClick={() => this.buildDeck()}>Create</button>
          </div>
        </div>
      </div>
    );
  }

  parseDeckLists() {
    const decks = this.state.decks;

    const parsedList = decks.map((deck) => {
      const formatted = (
        <div className="card" key={deck.id} style={CardStyle}>
          {!deck.modify && <div className="card-header">public</div>}
          <div className="card-body">
            <h2 className="card-title">{deck.name}</h2>
            <h3 className="card-subtitle">{deck.deck_list.character.name}</h3>
            <div className="card-text">{parseDeckList(deck.deck_list)}</div>
            {deck.modify && <button onClick={() => this.buildDeck(deck.id)}>edit</button>}
          </div>
        </div>
      );

      return <div className="sm-3 col">{formatted}</div>;
    });

    return (
      <div className="row flex-left" style={{ width: '100%' }}>
        {this.newDeck()}
        {parsedList}
      </div>
    );
  }

  getDeckList() {
    return (
      <>
        <h2>Decks</h2>
        <p style={ParagraphStyle}>
          Public decks are available to everyone and cannot be modified.
        </p>
        {this.parseDeckLists()}
      </>
    );
  }

  render() {
    return (
      <div style={baseStyle}>
        {!this.state.build && this.getDeckList()}
        {this.state.build && (
          <ITCGDeckBuilder
            server={this.props.server}
            deckID={this.state.buildDeck}
            update={(obj) => this.updateSelf(obj)}
          />
        )}
      </div>
    );
  }
}

export function parseDeckList(deck: Deck) {
  if (!deck.character) return;
  return (
    <div>
      {deck.deck.map((card) => {
        return (
          <div>
            {card[1]} {card[0].name}
          </div>
        );
      })}
    </div>
  );
}
