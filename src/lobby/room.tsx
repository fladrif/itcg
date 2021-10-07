import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import { getRandomKey } from '../utils';
import { AppState } from '../App';

interface RoomProp {
  server: string;
  update: (state: AppState) => void;
}

interface Room {
  id: string;
  owner: string;
  opp?: string;
}

interface State {
  rooms: Room[];
  activeRoom?: Room;
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '70vw',
};

const roomStyle: React.CSSProperties = {
  margin: '3%',
  padding: '1%',
  border: 'groove',
};

const buttonStyle: React.CSSProperties = {
  textShadow: '1px 1px 2px grey',
  fontSize: '120%',
  borderRadius: '0.5em',
  alignItems: 'center',
  width: '10%',
  marginTop: '1%',
  marginLeft: '80%',
};

export class ITCGRoom extends React.Component<RoomProp> {
  state: State;
  timerID: any;

  constructor(prop: RoomProp) {
    super(prop);
    this.state = { rooms: [] };
  }

  async updateSelf() {
    const resp = await axios.get('/rooms', {
      baseURL: this.props.server,
      timeout: 1000,
      withCredentials: true,
    });

    const rooms = resp.data;
    if (!rooms) return;

    if (!Array.isArray(rooms)) {
      this.setState({ activeRoom: rooms });
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

  getActiveRoom(room: Room) {
    return (
      <div>
        <h1>Duel Preparation</h1>
        Owner: <b>{room.owner}</b>
        <br />
        Ready: <b>false</b>
        <br />
        <br />
        Opponent: <b>{room.opp}</b>
        <br />
        Ready: <b>false</b>
        <br />
        <Button style={buttonStyle} onClick={() => this.leaveRoom(room.id)}>
          Leave Room
        </Button>
      </div>
    );
  }

  getRoomList(rooms: Room[]) {
    return (
      <div>
        <h1>Rooms</h1>
        {rooms.map((rm) => (
          <div style={roomStyle}>
            <b>User</b>: {rm.owner}
            <Button style={buttonStyle} onClick={() => this.joinRoom(rm.id)}>
              Join Room
            </Button>
          </div>
        ))}
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
          <Button style={buttonStyle} onClick={() => this.makeRoom()}>
            Create Room
          </Button>
        )}
        {this.getRooms()}
      </div>
    );
  }
}
