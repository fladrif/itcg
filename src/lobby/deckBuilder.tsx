import React from 'react';
import lodash from 'lodash';
// import { Redirect } from 'react-router-dom';
import { Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import axios from 'axios';

import { CardClasses, CardTypes, NonCharacter } from '../card';
import { Deck } from '../game';

import { State as DeckState } from './deck';

interface DeckBuilderProp {
  server: string;
  update: (state: Partial<DeckState>) => void;
  deckID?: string;
}

interface CardDictionary {
  [key: string]: Omit<NonCharacter, 'key' | 'owner'>;
}

interface Filter {
  class?: CardClasses;
  type?: CardTypes;
}

interface State {
  name: string;
  deckList?: Deck;
  warning?: string;

  filter: Filter;
  cardList?: CardDictionary;

  curCard?: Omit<NonCharacter, 'key' | 'owner'>;
  curQuantity: number;
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '70vw',
};

const buttonStyle: React.CSSProperties = {
  textShadow: '1px 1px 2px grey',
  alignItems: 'center',
  fontSize: '120%',
  marginLeft: '1%',
};

const negButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: 'red',
  color: 'white',
  borderRadius: '0.3em',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  textShadow: '1px 1px 2px grey',
  border: 'ridge',
};

const formRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  margin: '3%',
  whiteSpace: 'nowrap',
};

const buttonRowStyle: React.CSSProperties = {
  ...formRowStyle,
  alignSelf: 'end',
};

const deckListRowStyle: React.CSSProperties = {
  ...formRowStyle,
  margin: '1%',
  marginLeft: '3%',
  marginRight: '3%',
};

const formCompStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
  marginLeft: '1%',
};

const formCompNoExpandStyle: React.CSSProperties = {
  ...formCompStyle,
  flex: '0',
};

const formHeaderCompStyle: React.CSSProperties = {
  ...formCompStyle,
  fontSize: '125%',
};

const listCardStyle: React.CSSProperties = {
  marginLeft: '5%',
};

const warningStyle: React.CSSProperties = {
  color: 'red',
};

export class ITCGDeckBuilder extends React.Component<DeckBuilderProp> {
  state: State;

  constructor(prop: DeckBuilderProp) {
    super(prop);
    this.state = { curQuantity: 4, name: 'Default Deck Name', filter: {} };
    this.keyPressEnter = this.keyPressEnter.bind(this);
  }

  async componentDidMount() {
    if (this.props.deckID) await this.getDeckInfo();

    await this.getCardList();
    document.addEventListener('keydown', this.keyPressEnter);
  }

  componentDidUnMount() {
    document.removeEventListener('keydown', this.keyPressEnter);
  }

  keyPressEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.addCard();
    }
  }

  async getCardList() {
    const resp = await axios('/cards', {
      baseURL: this.props.server,
      timeout: 1000,
      withCredentials: true,
    });

    if (!resp.data) return;

    this.setState({ cardList: resp.data });
  }

  async getDeckInfo() {
    const resp = await axios(`/decks/${this.props.deckID}`, {
      baseURL: this.props.server,
      timeout: 1000,
      withCredentials: true,
    });

    if (!resp.data) return;

    this.setState({ name: resp.data.name, deckList: resp.data.deck_list });
  }

  async deleteDeck() {
    const delResp = await axios
      .post(
        `/decks/delete`,
        {
          deckId: this.props.deckID,
        },
        {
          baseURL: this.props.server,
          timeout: 1000,
          withCredentials: true,
        }
      )
      .catch((error) => {
        if (error.response) return this.setState({ warning: error.response.data });
        if (error) this.setState({ warning: error.toString() });
      });

    if (delResp) this.props.update({ build: false, buildDeck: undefined });
  }

  exitWOSave() {
    this.props.update({ build: false, buildDeck: undefined });
  }

  async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const pushResp = await axios
      .post(
        `/decks/upsert`,
        {
          deckId: this.props.deckID,
          deckName: this.state.name,
          deckList: this.state.deckList,
        },
        {
          baseURL: this.props.server,
          timeout: 1000,
          withCredentials: true,
        }
      )
      .catch((error) => {
        if (error.response) return this.setState({ warning: error.response.data });
        if (error) this.setState({ warning: error.toString() });
      });

    if (pushResp) this.props.update({ build: false, buildDeck: undefined });
  }

  async findCard(name: string): Promise<Omit<NonCharacter, 'key' | 'owner'>> {
    while (!this.state.cardList) {
      await this.getCardList();
    }
    return Object.values(this.state.cardList).filter((card) => card.name === name)[0];
  }

  addCard() {
    if (!this.state.curCard) return;

    const curList = this.state.deckList?.deck ?? [];

    if (curList.find((cards) => cards[0].name === this.state.curCard!.name)) {
      return;
    }

    this.setState({
      deckList: {
        deck: curList.concat([[this.state.curCard, this.state.curQuantity]]),
        character: this.state.deckList?.character,
      },
    });
  }

  incCard(cardName: string) {
    if (!this.state.deckList) return;
    const list = this.state.deckList.deck;

    this.setState({
      deckList: {
        character: this.state.deckList.character,
        deck: list.map((tuple) => {
          if (tuple[0].name === cardName) {
            return [tuple[0], tuple[1] + 1 <= 4 ? tuple[1] + 1 : tuple[1]];
          } else {
            return tuple;
          }
        }),
      },
    });
  }

  decCard(cardName: string) {
    if (!this.state.deckList) return;
    const list = this.state.deckList.deck;

    this.setState({
      deckList: {
        character: this.state.deckList.character,
        deck: lodash(list)
          .map((tuple) => {
            if (tuple[0].name === cardName) {
              if (tuple[1] === 1) return undefined;
              return [tuple[0], tuple[1] - 1];
            } else {
              return tuple;
            }
          })
          .compact()
          .value(),
      },
    });
  }

  renderDeckList() {
    const list = this.state.deckList?.deck;

    if (!list) return;
    const cardList = list.map((card) => {
      return (
        <div style={deckListRowStyle} key={card[0].name}>
          <Button onClick={() => this.incCard(card[0].name)}>+</Button>
          <Button onClick={() => this.decCard(card[0].name)}>-</Button>
          <div style={listCardStyle}>{card[1]}</div>
          <div style={listCardStyle}>{card[0].name}</div>
        </div>
      );
    });

    return <>{cardList}</>;
  }

  renderCardList(characterList?: boolean) {
    const list = [];

    if (!this.state.cardList) return;

    for (const key of Object.keys(this.state.cardList)) {
      const card = this.state.cardList[key];
      if (!characterList === (card.type === CardTypes.Character)) continue;
      if (
        !characterList &&
        ((this.state.filter.class &&
          this.state.filter.class !== this.state.cardList[key].class) ||
          (this.state.filter.type &&
            this.state.filter.type !== this.state.cardList[key].type))
      )
        continue;

      list.push(card);
    }

    return lodash(list)
      .orderBy((card) => card.name)
      .map((card) => {
        return <option key={card.name}>{card.name}</option>;
      })
      .value();
  }

  render() {
    return (
      <div style={baseStyle}>
        <h1>Deck Builder</h1>
        <form onSubmit={async (e) => await this.handleSubmit(e)} style={formStyle}>
          <FormGroup controlId={'header'} style={formRowStyle}>
            <FormControl
              type={'text'}
              value={this.state.name ?? 'Default Deck Name'}
              onChange={(e) => this.setState({ name: e.target.value })}
              style={formHeaderCompStyle}
            />
            <FormControl
              as={'select'}
              value={this.state.deckList?.character?.name}
              onChange={async (e) =>
                this.setState({
                  deckList: {
                    character: await this.findCard(e.target.value),
                    deck: this.state.deckList?.deck ?? [],
                  },
                })
              }
              style={formHeaderCompStyle}
            >
              <option>Select Character</option>
              {this.renderCardList(true)}
            </FormControl>
          </FormGroup>
          <FormGroup controlId={'filter'} style={formRowStyle}>
            <div style={formCompStyle}>
              <FormLabel>Class</FormLabel>
              <FormControl
                as={'select'}
                onChange={(e) =>
                  this.setState({
                    filter: {
                      class: e.target.value === 'All' ? undefined : e.target.value,
                      type: this.state.filter.type,
                    },
                  })
                }
              >
                <option>All</option>
                <option>Bowman</option>
                <option>Magician</option>
                <option>Thief</option>
                <option>Warrior</option>
              </FormControl>
            </div>
            <div style={formCompStyle}>
              <FormLabel>Type</FormLabel>
              <FormControl
                as={'select'}
                onChange={(e) =>
                  this.setState({
                    filter: {
                      type: e.target.value === 'All' ? undefined : e.target.value,
                      class: this.state.filter.class,
                    },
                  })
                }
              >
                <option>All</option>
                <option>Monster</option>
                <option>Tactic</option>
                <option>Item</option>
              </FormControl>
            </div>
            <div style={formCompStyle}>
              <FormLabel>Set</FormLabel>
              <FormControl as={'select'}>
                <option>All</option>
                <option>Set 1</option>
              </FormControl>
            </div>
          </FormGroup>
          <FormGroup controlId={'selection'} style={formRowStyle}>
            <div style={formCompStyle}>
              <FormLabel>Card</FormLabel>
              <FormControl
                as={'select'}
                onChange={async (e) =>
                  this.setState({ curCard: await this.findCard(e.target.value) })
                }
                autoFocus
              >
                <option></option>
                {this.renderCardList()}
              </FormControl>
              Tip: While focused on the card list, type in the card you're looking for and
              hit enter to add it to the deck list.
            </div>
            <div style={formCompNoExpandStyle}>
              <FormLabel>Quantity</FormLabel>
              <FormControl
                as={'select'}
                defaultValue={'4'}
                onChange={(e) => this.setState({ curQuantity: parseInt(e.target.value) })}
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </FormControl>
            </div>
            <Button style={buttonStyle} onClick={() => this.addCard()}>
              Add
            </Button>
          </FormGroup>
          <div style={formRowStyle}>
            <div style={formCompStyle}>
              Deck List:{' '}
              {this.state.deckList?.deck.reduce((acc, card) => card[1] + acc, 0) || 0} /
              40
              <div style={formStyle}>{this.renderDeckList()}</div>
            </div>
          </div>
          <FormGroup controlId={'buttons'} style={buttonRowStyle}>
            {this.state.warning && <div style={warningStyle}>{this.state.warning}</div>}
            <Button style={negButtonStyle} onClick={() => this.deleteDeck()}>
              Delete Deck
            </Button>
            <Button style={buttonStyle} type={'submit'}>
              Save Deck
            </Button>
            <Button style={buttonStyle} onClick={() => this.exitWOSave()}>
              Exit Without Saving
            </Button>
          </FormGroup>
        </form>
      </div>
    );
  }
}
