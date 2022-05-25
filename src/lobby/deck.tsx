import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

import { ITCGDeckBuilder } from './deckBuilder';
import { OverallListStyle, ListItemStyle } from './list.css';
import { ButtonStyle, OverallButtonStyle, ParagraphStyle } from './overall.css';

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
  display: 'flex',
  flexDirection: 'column',
  width: '70vw',
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

  parseDeckList(deck: Deck) {
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

  parseDeckLists() {
    const decks = this.state.decks;

    const parsedList = decks.map((deck) => {
      return (
        <div style={OverallListStyle} key={deck.id}>
          <div style={ListItemStyle}>
            Name: <h2>{deck.name}</h2>
          </div>
          <div style={ListItemStyle}>
            Character: <h3>{deck.deck_list.character.name}</h3>
          </div>
          <div style={ListItemStyle}>{this.parseDeckList(deck.deck_list)}</div>
          {deck.modify && (
            <Button style={ButtonStyle} onClick={() => this.buildDeck(deck.id)}>
              Modify Deck
            </Button>
          )}
        </div>
      );
    });

    return <>{parsedList}</>;
  }

  getDeckList() {
    return (
      <>
        <Button style={OverallButtonStyle} onClick={() => this.buildDeck()}>
          Create new Deck
        </Button>
        <h1>Decks</h1>
        <p style={ParagraphStyle}>
          Deck lists without buttons are public and available to everyone, but cannot be
          modified.
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
