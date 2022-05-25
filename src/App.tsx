import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
// import { Local } from 'boardgame.io/multiplayer';
import Cookies from 'js-cookie';

import { ITCG } from './game';
import { ITCGBoard } from './itcgBoard';
import {
  ITCGDeck,
  ITCGHeader,
  ITCGSignUp,
  ITCGLogIn,
  ITCGLogOut,
  ITCGRoom,
  ITCGFrontPage,
  ITCGHowToPlay,
  ITCGDevLog,
  ITCGResources,
} from './lobby';
import { SERVER, USER_COOKIE_NAME } from './config';

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  verticalAlign: 'middle',
  overflowY: 'auto',
};

const clientStyle: React.CSSProperties = {
  width: '100vw',
};

export interface GamePlayerData {
  matchID: string;
  playerID: string;
  credentials: string;
}

export interface AppState {
  username?: string;
  inGame?: GamePlayerData;
}

class App extends React.Component {
  state: AppState;

  constructor(prop: any) {
    super(prop);
    this.state = { username: Cookies.get(USER_COOKIE_NAME) };
  }

  async componentDidMount() {
    await this.updateState({});
  }

  async updateState(state: AppState) {
    const resp = await axios
      .get('/lobby/inGame', {
        baseURL: SERVER,
        timeout: 5000,
        withCredentials: true,
      })
      .catch((err) => {
        console.error(err);
      });

    if (!resp || !resp.data) return this.setState({ ...state, inGame: undefined });

    this.setState({ ...state, inGame: resp.data });
  }

  render() {
    const GameClient = Client({
      game: ITCG,
      board: ITCGBoard,
      multiplayer: SocketIO({ server: SERVER }),
      debug: false,
    });

    return (
      <div style={style}>
        <Router>
          {!this.state.inGame && (
            <Switch>
              <Route exact path={'/'}>
                <ITCGHeader username={this.state.username} />
                <ITCGFrontPage username={this.state.username} />
              </Route>
              <Route path={'/rooms'}>
                <ITCGHeader username={this.state.username} />
                {this.state.username && (
                  <ITCGRoom
                    server={SERVER}
                    username={this.state.username}
                    update={this.updateState.bind(this)}
                  />
                )}
              </Route>
              <Route path={'/decks'}>
                <ITCGHeader username={this.state.username} />
                {this.state.username && <ITCGDeck server={SERVER} />}
              </Route>
              <Route path={'/howtoplay'}>
                <ITCGHeader username={this.state.username} />
                <ITCGHowToPlay />
              </Route>
              <Route path={'/devlog'}>
                <ITCGHeader username={this.state.username} />
                <ITCGDevLog />
              </Route>
              <Route path={'/resources'}>
                <ITCGHeader username={this.state.username} />
                <ITCGResources />
              </Route>
              <Route path={'/signup'}>
                <ITCGHeader />
                <ITCGSignUp server={SERVER} update={this.updateState.bind(this)} />
              </Route>
              <Route path={'/login'}>
                <ITCGHeader />
                <ITCGLogIn server={SERVER} update={this.updateState.bind(this)} />
              </Route>
              <Route path={'/logout'}>
                <ITCGHeader />
                <ITCGLogOut server={SERVER} update={this.updateState.bind(this)} />
              </Route>
            </Switch>
          )}
          {!!this.state.inGame && (
            <div style={clientStyle}>
              <GameClient
                matchID={this.state.inGame.matchID}
                playerID={this.state.inGame.playerID}
                credentials={this.state.inGame.credentials}
              />
            </div>
          )}
        </Router>
      </div>
    );
  }
}

export default App;
