import React from 'react';
import axios from 'axios';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import Cookies from 'js-cookie';

import { ITCG } from './game';
import { ITCGBoard } from './itcgBoard';
import {
  ITCGCards,
  ITCGDeck,
  ITCGHeader,
  ITCGSignUp,
  ITCGLogIn,
  ITCGLogOut,
  ITCGRoom,
  ITCGAdmin,
  ITCGFrontPage,
  ITCGHowToPlay,
  ITCGDevLog,
  ITCGResources,
} from './lobby';
import { SERVER, MAX_WIDTH, ADMIN_COOKIE_NAME, USER_COOKIE_NAME } from './config';

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  verticalAlign: 'middle',
  overflowY: 'auto',
  backgroundColor: '#FAF8F0',
  height: '100vh',
};

const clientStyle: React.CSSProperties = {
  width: '100vw',
};

export interface GamePlayerData {
  matchID: string;
  playerID?: string;
  credentials?: string;
}

export interface AppState {
  username?: string;
  isAdmin?: boolean;
  inGame?: GamePlayerData;
}

class App extends React.Component {
  state: AppState;

  constructor(prop: any) {
    super(prop);
    const state: AppState = { username: Cookies.get(USER_COOKIE_NAME) };
    const isAdmin = Cookies.get(ADMIN_COOKIE_NAME);
    if (isAdmin) state.isAdmin = !!isAdmin;

    this.state = state;
  }

  async componentDidMount() {
    if (this.state.username) await this.updateState({});
  }

  async updateState(state: AppState) {
    const resp = await axios
      .get('/lobby/inGame', {
        baseURL: SERVER,
        timeout: 8000,
        withCredentials: true,
      })
      .catch((err) => {
        if (err.response.status === 422) {
          // Auth Cookie expired; logout user to refresh
          return this.setState({ username: '', inGame: undefined });
        } else {
          console.error(err);
        }
      });

    if (!resp || !resp.data) {
      if (!!state.inGame) return this.setState(state);

      return this.setState({ ...state, inGame: undefined });
    }

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
      <>
        <BrowserRouter>
          {this.state.username === '' && <Redirect to={'/logout'} />}
          {!this.state.inGame && (
            <div style={style}>
              <ITCGHeader username={this.state.username} isAdmin={this.state.isAdmin} />
              <div style={{ maxWidth: MAX_WIDTH, width: '100%' }}>
                <Switch>
                  <Route exact path={'/'}>
                    {!this.state.username && <ITCGFrontPage />}
                    {this.state.username && (
                      <ITCGRoom
                        server={SERVER}
                        username={this.state.username}
                        update={this.updateState.bind(this)}
                      />
                    )}
                  </Route>
                  <Route path={'/decks'}>
                    {this.state.username && <ITCGDeck server={SERVER} />}
                  </Route>
                  <Route path={'/admin'}>
                    {this.state.username && <ITCGAdmin server={SERVER} />}
                  </Route>
                  <Route path={'/howtoplay'}>
                    <ITCGHowToPlay />
                  </Route>
                  <Route path={'/cards'}>
                    <ITCGCards />
                  </Route>
                  <Route path={'/about'}>
                    <ITCGResources />
                    <ITCGDevLog />
                  </Route>
                  <Route path={'/signup'}>
                    <ITCGSignUp server={SERVER} update={this.updateState.bind(this)} />
                  </Route>
                  <Route path={'/login'}>
                    <ITCGLogIn server={SERVER} update={this.updateState.bind(this)} />
                  </Route>
                  <Route path={'/logout'}>
                    <ITCGLogOut server={SERVER} update={this.updateState.bind(this)} />
                  </Route>
                </Switch>
              </div>
            </div>
          )}
          {!!this.state.inGame && !!this.state.inGame.playerID && (
            <div style={clientStyle}>
              <GameClient
                matchID={this.state.inGame.matchID}
                playerID={this.state.inGame.playerID}
                credentials={this.state.inGame.credentials}
              />
            </div>
          )}
          {!!this.state.inGame && !this.state.inGame.playerID && (
            <div style={clientStyle}>
              <GameClient matchID={this.state.inGame.matchID} />
            </div>
          )}
        </BrowserRouter>
      </>
    );
  }
}

export default App;
