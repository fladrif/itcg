import React from 'react';
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
} from './lobby';
import { SERVER, USER_COOKIE_NAME } from './config';

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  verticalAlign: 'middle',
  overflow: 'scroll',
};

export interface AppState {
  username?: string;
  inGame?: boolean;
}

class App extends React.Component {
  state: AppState;

  constructor(prop: any) {
    super(prop);
    this.state = { username: Cookies.get(USER_COOKIE_NAME) };
  }

  updateState(state: AppState) {
    this.setState(state);
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
          <Switch>
            <Route exact path={'/'}>
              <ITCGHeader username={this.state.username} />
              <ITCGFrontPage username={this.state.username} />
            </Route>
            <Route path={'/rooms'}>
              <ITCGHeader username={this.state.username} />
              {this.state.username && (
                <ITCGRoom server={SERVER} update={this.updateState.bind(this)} />
              )}
            </Route>
            <Route path={'/decks'}>
              <ITCGHeader username={this.state.username} />
              {this.state.username && (
                <ITCGDeck server={SERVER} update={this.updateState.bind(this)} />
              )}
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
            {this.state.inGame && <GameClient />}
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
