import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import { OverallListStyle, ListItemStyle } from './list.css';
import { ButtonStyle, OverallButtonStyle } from './overall.css';
import { DeckMetaData } from './deck';

import { getRandomKey } from '../utils';
import { AppState } from '../App';
import { Deck } from '../game';

interface RoomProp {
  server: string;
  update: (state: AppState) => void;
}

interface RoomUser {
  name: string;
  owner: boolean;
  deck?: string;
}

interface Room {
  id: string;

  users: RoomUser[];
}

interface State {
  rooms: Room[];
  decks: DeckMetaData[];
  activeRoom?: Room;
}

const readyStyle: React.CSSProperties = {
  color: 'green',
};

const notReadyStyle: React.CSSProperties = {
  color: 'red',
};

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '70vw',
};

const formCompStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: '1',
  marginLeft: '1%',
};

const formHeaderCompStyle: React.CSSProperties = {
  ...formCompStyle,
  fontSize: '125%',
};

export class ITCGRoom extends React.Component<RoomProp> {
  state: State;
  timerID: any;

  constructor(prop: RoomProp) {
    super(prop);
    this.state = { rooms: [], decks: [] };
  }

  async updateSelf() {
    const resp = await axios.get('/rooms', {
      baseURL: this.props.server,
      timeout: 1000,
      withCredentials: true,
    });

    const rooms = resp.data;
    if (!rooms) return;

    const deckResp = await axios('/decks', {
      baseURL: this.props.server,
      timeout: 1000,
      withCredentials: true,
    });
    if (!deckResp.data) return;

    if (!Array.isArray(rooms)) {
      this.setState({ activeRoom: rooms, decks: deckResp.data });
    } else {
      this.setState({ rooms: rooms, activeRoom: undefined });
    }
  }

  async componentDidMount() {
    await this.updateSelf();

    this.timerID = setInterval(async () => await this.updateSelf(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getPlayerDecks() {
    const decks = this.state.decks;

    return decks.map((deck) => {
      return <option value={deck.id}>{deck.name}</option>;
    });
  }

  getActiveRoom(room: Room) {
    const owner = room.users.find((usr) => usr.owner === true);
    const guest = room.users.find((usr) => usr.owner === false);

    return (
      <>
        <h1>Duel Preparation</h1>
        <div style={OverallListStyle}>
          <div style={ListItemStyle}>
            Owner: <h3>{owner.name}</h3>
          </div>
          <div style={ListItemStyle}>
            Owner Ready:{' '}
            <h3 style={!!owner?.deck ? readyStyle : notReadyStyle}>
              {!!owner.deck ? 'true' : 'false'}
            </h3>
          </div>
          <div style={ListItemStyle}>
            Guest: <h3>{guest?.name || ''}</h3>
          </div>
          <div style={ListItemStyle}>
            Guest Ready:{' '}
            <h3 style={!!guest?.deck ? readyStyle : notReadyStyle}>
              {!!guest?.deck ? 'true' : 'false'}
            </h3>
          </div>
          <div style={ListItemStyle}>
            <FormControl
              as={'select'}
              style={formHeaderCompStyle}
              onChange={(e) => this.updateRoom(room.id, e.target.value)}
            >
              <option value={''}>Select Deck</option>
              {this.getPlayerDecks()}
            </FormControl>
          </div>
          <Button style={ButtonStyle} onClick={() => this.leaveRoom(room.id)}>
            Leave Room
          </Button>
        </div>
      </>
    );
  }

  getRoomList(rooms: Room[]) {
    const styledRooms = rooms.map((rm) => (
      <div style={OverallListStyle}>
        <div style={ListItemStyle}>
          User: <h2>{rm.users.find((usr) => usr.owner === true).name}</h2>
        </div>
        <Button style={ButtonStyle} onClick={() => this.joinRoom(rm.id)}>
          Join Room
        </Button>
      </div>
    ));

    return (
      <div>
        <h1>Rooms</h1>
        {styledRooms}
      </div>
    );
  }

  getRooms() {
    if (!!this.state.activeRoom) {
      return this.getActiveRoom(this.state.activeRoom);
    }

    const rooms = this.state.rooms;
    if (rooms.length > 0) {
      return this.getRoomList(rooms);
    } else {
      return <h2>No Open Rooms</h2>;
    }
  }

  async makeRoom() {
    if (!!this.state.activeRoom) return;

    await axios
      .post(
        '/rooms/create',
        {},
        {
          baseURL: this.props.server,
          timeout: 1000,
          withCredentials: true,
        }
      )
      .catch((err) => {
        console.error(err);
      });
  }

  async joinRoom(id: string) {
    if (!!this.state.activeRoom) return;

    await axios
      .post(
        '/rooms/join',
        { id },
        {
          baseURL: this.props.server,
          timeout: 1000,
          withCredentials: true,
        }
      )
      .catch((err) => {
        console.error(err);
      });
  }

  async updateRoom(id: string, deckID: string) {
    await axios
      .post(
        '/rooms/update',
        { id, deckID },
        {
          baseURL: this.props.server,
          timeout: 1000,
          withCredentials: true,
        }
      )
      .catch((err) => {
        console.error(err);
      });
  }

  async leaveRoom(id: string) {
    await axios
      .post(
        '/rooms/leave',
        { id },
        {
          baseURL: this.props.server,
          timeout: 1000,
          withCredentials: true,
        }
      )
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return (
      <div style={baseStyle}>
        {!this.state.activeRoom && (
          <Button style={OverallButtonStyle} onClick={() => this.makeRoom()}>
            Create Room
          </Button>
        )}
        {this.getRooms()}
      </div>
    );
  }
}
