import React from 'react';
import { Button, FormControl } from 'react-bootstrap';
import axios from 'axios';

import { OverallListStyle, ListItemStyle } from './list.css';
import { ButtonStyle, OverallButtonStyle, ParagraphStyle } from './overall.css';
import { DeckMetaData } from './deck';

import { AppState } from '../App';

interface RoomProp {
  server: string;
  username: string;
  update: (state: AppState) => Promise<void>;
}

interface RoomUser {
  name: string;
  owner: boolean;
  ready: boolean;
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

export class ITCGRoom extends React.Component<RoomProp, State> {
  state: State;
  timerID?: NodeJS.Timeout;

  constructor(prop: RoomProp) {
    super(prop);
    this.state = { rooms: [], decks: [] };
  }

  async updateSelf() {
    const resp = await axios.get('/rooms', {
      baseURL: this.props.server,
      timeout: 5000,
      withCredentials: true,
    });

    const rooms = resp.data;
    if (!rooms) return;

    const deckResp = await axios('/decks', {
      baseURL: this.props.server,
      timeout: 5000,
      withCredentials: true,
    });
    if (!deckResp.data) return;

    if (!Array.isArray(rooms)) {
      this.setState({ activeRoom: rooms, decks: deckResp.data });
    } else {
      this.setState({ rooms: rooms, activeRoom: undefined });
    }
  }

  roomBlurb = (
    <p style={ParagraphStyle}>
      Challenge others to a game by <b>joining</b> or <b>creating</b> a room. Use the
      Discord to prearrange games with other players.
    </p>
  );

  shouldComponentUpdate(_nextProps: RoomProp, nextState: State) {
    if (!nextState.activeRoom && this.state.activeRoom) this.props.update({});
    return true;
  }

  async componentDidMount() {
    await this.updateSelf();

    this.timerID = setInterval(async () => await this.updateSelf(), 500);
  }

  componentWillUnmount() {
    if (this.timerID) clearInterval(this.timerID);
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

    const cur = room.users.find((usr) => usr.name === this.props.username);
    const opp = room.users.find((usr) => usr.name !== this.props.username);

    return (
      <>
        <h1>Duel Preparation</h1>
        <div style={OverallListStyle}>
          <div style={ListItemStyle}>
            Owner: <h3>{owner?.name || ''}</h3>
          </div>
          <div style={ListItemStyle}>
            Guest: <h3>{guest?.name || ''}</h3>
          </div>
          <div style={ListItemStyle}>
            Opponent Status:{' '}
            <h3 style={!!opp?.ready ? readyStyle : notReadyStyle}>
              {!!opp?.ready ? 'Ready' : 'Not Ready'}
            </h3>
          </div>
          <div style={ListItemStyle}>
            <FormControl
              as={'select'}
              style={formHeaderCompStyle}
              value={cur.deck || ''}
              onChange={(e) => this.updateRoom(room.id, { deckID: e.target.value })}
              disabled={cur?.ready}
            >
              <option value={''}>Select Deck</option>
              {this.getPlayerDecks()}
            </FormControl>
          </div>
          <Button
            style={ButtonStyle}
            disabled={!cur?.deck || cur?.ready}
            onClick={() => this.updateRoom(room.id, { ready: true })}
          >
            Lock In
          </Button>
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
          User: <h2>{rm.users.find((usr) => usr.owner === true)?.name || ''}</h2>
        </div>
        <Button style={ButtonStyle} onClick={() => this.joinRoom(rm.id)}>
          Join Room
        </Button>
      </div>
    ));

    return (
      <div>
        <h1>Rooms</h1>
        {this.roomBlurb}
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
      return (
        <>
          <h2>No Open Rooms</h2>
          {this.roomBlurb}
        </>
      );
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
          timeout: 5000,
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
          timeout: 5000,
          withCredentials: true,
        }
      )
      .catch((err) => {
        console.error(err);
      });
  }

  async updateRoom(id: string, { deckID, ready }: { deckID?: string; ready?: boolean }) {
    await axios
      .post(
        '/rooms/update',
        { id, deckID, ready },
        {
          baseURL: this.props.server,
          timeout: 5000,
          withCredentials: true,
        }
      )
      .catch((err) => {
        console.error(err);
      });

    await this.props.update({});
  }

  async leaveRoom(id: string) {
    await axios
      .post(
        '/rooms/leave',
        { id },
        {
          baseURL: this.props.server,
          timeout: 5000,
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
