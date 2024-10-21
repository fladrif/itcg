import React from 'react';
import { FormControl } from 'react-bootstrap';
import axios from 'axios';

import {
  CardStyle,
  LoadStyle,
  ParagraphStyle,
  SecCardStyle,
  TriCardStyle,
} from './overall.css';
import { DeckMetaData, parseDeckList } from './deck';

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

interface Game {
  title: string;
  id: string;
  updated_at: string;
}

interface State {
  initialLoad: boolean;
  rooms: Room[];
  ongoingGames: Game[];
  decks: DeckMetaData[];
  activeRoom?: Room;
}

const baseStyle: React.CSSProperties = {
  margin: '1%',
  display: 'flex',
  flexDirection: 'column',
};

export class ITCGRoom extends React.Component<RoomProp, State> {
  state: State;
  timerID?: NodeJS.Timeout;

  constructor(prop: RoomProp) {
    super(prop);
    this.state = { rooms: [], decks: [], ongoingGames: [], initialLoad: false };
  }

  async updateSelf() {
    const [roomResp, deckResp, ongoingResp] = await Promise.all([
      axios.get('/rooms', {
        baseURL: this.props.server,
        timeout: 5000,
        withCredentials: true,
      }),
      axios.get('/decks', {
        baseURL: this.props.server,
        timeout: 5000,
        withCredentials: true,
      }),
      axios.get('/lobby/ongoing', {
        baseURL: this.props.server,
        timeout: 5000,
        withCredentials: true,
      }),
    ]);
    const rooms = roomResp.data;
    if (!deckResp.data || !rooms) return;

    if (!Array.isArray(rooms)) {
      this.setState({ activeRoom: rooms, decks: deckResp.data, initialLoad: true });
    } else {
      this.setState({
        rooms: rooms,
        ongoingGames: ongoingResp.data,
        activeRoom: undefined,
        initialLoad: true,
      });
    }
  }

  roomBlurb = (
    <p style={ParagraphStyle}>
      Challenge others to a game by <b>joining</b> or <b>opening</b> a table. Use the{' '}
      <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/Sh9MAEPPXH">
        Discord server
      </a>{' '}
      to arrange games with other players.
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

  tableOppPlayer(opp?: RoomUser) {
    return (
      <>
        {!!opp && (
          <h3 className="margin-none">
            <span className="badge primary">{opp?.name || ''}</span>
          </h3>
        )}
        <div className="row flex-center border border-4 border-dashed shadow">
          <p className="col">
            <h3
              className={`margin-none ${
                !!opp ? (opp?.ready ? 'text-success' : 'text-warning') : 'text-danger'
              }`}
            >
              {!!opp?.ready
                ? 'Ready to Battle!'
                : !!opp
                ? 'Selecting a Deck...'
                : 'Waiting for Opponent'}
            </h3>
          </p>
        </div>
      </>
    );
  }

  tableCurPlayer(roomID: string, cur: RoomUser) {
    const readyBtnClass = cur?.ready ? 'btn-success' : 'btn-primary';
    const deck = this.state.decks.find((deck) => deck.id === cur.deck)?.deck_list;

    return (
      <>
        <h3 className="margin-none">
          <span className="badge primary">{cur.name}</span>
        </h3>
        <div className="col row flex-spaces border border-3 border-dashed shadow">
          <div className="col sm-7">
            <FormControl
              as={'select'}
              value={cur.deck || ''}
              onChange={(e) => this.updateRoom(roomID, { deckID: e.target.value })}
              disabled={cur?.ready}
            >
              <option value={''}>Select Deck</option>
              {this.getPlayerDecks()}
            </FormControl>
            <div className="card">
              <div className="card-body">
                {(!!deck && (
                  <>
                    <h4 className="card-subtitle">{deck.character.name}</h4>
                    <div className="card-text">{parseDeckList(deck)}</div>
                  </>
                )) || <h4 className="card-title">No Deck Selected</h4>}
              </div>
            </div>
          </div>
          <button
            disabled={!cur?.deck || cur?.ready}
            className={readyBtnClass + ' col sm-2'}
            onClick={() => this.updateRoom(roomID, { ready: true })}
          >
            {cur?.ready && 'Ready!'}
            {!cur?.ready && 'Ready...?'}
          </button>
        </div>
      </>
    );
  }

  getActiveRoom(room: Room) {
    const owner = room.users.find((usr) => usr.owner === true);

    const cur = room.users.find((usr) => usr.name === this.props.username);
    const opp = room.users.find((usr) => usr.name !== this.props.username);

    return (
      <>
        <div
          className="border row flex-center border-6 border-thick shadow"
          style={{ padding: '3%' }}
        >
          <div className="col sm-10 padding-none">{this.tableOppPlayer(opp)}</div>
          <h2 className="col sm-11 padding-none" style={{ textAlign: 'center' }}>
            {owner.name}'s Table
          </h2>
          <div className="col sm-12 padding-none">
            {this.tableCurPlayer(room.id, cur)}
          </div>
        </div>
        <div className="row flex-right">
          <button onClick={() => this.leaveRoom(room.id)} className="btn-danger col">
            Leave Table
          </button>
        </div>
      </>
    );
  }

  createRoomCard() {
    return (
      !this.state.activeRoom && (
        <div className="sm-3 col">
          <div className="card" key="new" style={CardStyle}>
            <div className="card-body">
              <h3 className="card-title">New Table</h3>
              <button onClick={() => this.makeRoom()}>Open</button>
            </div>
          </div>
        </div>
      )
    );
  }

  getRoomList(rooms: Room[], games: Game[]) {
    const styledRooms = rooms.map((rm) => (
      <div className="sm-3 col">
        <div className="card" style={CardStyle} key={rm.id}>
          <div className="card-body">
            <h3 className="card-title">
              {rm.users.find((usr) => usr.owner === true)?.name || ''}'s table
            </h3>
            <button onClick={() => this.joinRoom(rm.id)}>Sit down</button>
          </div>
        </div>
      </div>
    ));

    const styledGames = games.map((g) => {
      const lastMove = Math.floor(
        (Date.now() - new Date(g.updated_at).getTime()) / 1000 / 60
      );

      return (
        <div className="sm-6 col">
          <div
            className="card"
            style={lastMove >= 10 ? TriCardStyle : SecCardStyle}
            key={g.id}
          >
            <div
              className="card-body row flex-edges flex-bottom"
              style={{ width: '100%' }}
            >
              <h3 className="card-title col-12">{g.title}</h3>
              <p>
                {lastMove < 2 ? (
                  <strong>Currently Clashing!</strong>
                ) : (
                  <>
                    Last Move: <strong>{lastMove}</strong> minutes ago
                  </>
                )}
              </p>
              <button onClick={() => this.props.update({ inGame: { matchID: g.id } })}>
                Spectate
              </button>
            </div>
          </div>
        </div>
      );
    });

    return (
      <>
        <h2>Tables</h2>
        {this.roomBlurb}
        <div className="row flex-left" style={{ width: '100%' }}>
          {styledGames}
        </div>
        <div className="row flex-left" style={{ width: '100%' }}>
          {this.createRoomCard()}
          {styledRooms}
        </div>
      </>
    );
  }

  getRooms() {
    if (!!this.state.activeRoom) {
      return this.getActiveRoom(this.state.activeRoom);
    }

    const rooms = this.state.rooms;
    const games = this.state.ongoingGames;

    if (rooms.length > 0 || games.length > 0) {
      return this.getRoomList(rooms, games);
    } else {
      return (
        <>
          <h2>No Open Tables</h2>
          {this.roomBlurb}
          <div className="row flex-left" style={{ width: '100%' }}>
            {this.createRoomCard()}
          </div>
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
        {!this.state.initialLoad && (
          <>
            <h2>Tables</h2>
            <h2 className={'loading'} style={LoadStyle}>
              Loading
            </h2>
          </>
        )}
        {!!this.state.initialLoad && this.getRooms()}
      </div>
    );
  }
}
