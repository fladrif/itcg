import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

import { getRandomKey } from '../utils';

import { AppState } from '../App';
import { USER_COOKIE_NAME } from '../config';

interface LogInProp {
  server: string;
  update: (state: AppState) => void;
}

interface State {
  username: string;
  password: string;
  warning?: string;
  submitting: boolean;
  completed?: boolean;
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '1%',
};

const buttonStyle: React.CSSProperties = {
  textShadow: '1px 1px 2px grey',
  fontSize: '140%',
  alignItems: 'center',
  margin: '10%',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  textShadow: '1px 1px 2px grey',
};

const formCompStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  margin: '3%',
  whiteSpace: 'nowrap',
};

const warningStyle: React.CSSProperties = {
  color: 'red',
};

export class ITCGLogIn extends React.Component<LogInProp> {
  state: State;

  constructor(prop: LogInProp) {
    super(prop);
    this.state = { username: '', password: '', submitting: false };
  }

  async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!this.state.username) {
      this.setState({ warning: 'Username missing' });
      return;
    }

    if (!this.state.password) {
      this.setState({ warning: 'Passphrase missing' });
      return;
    }

    this.setState({ submitting: true, warning: '' });

    const resp = await axios
      .get(`/getNonce`, {
        baseURL: this.props.server,
        params: { username: this.state.username },
        timeout: 5000,
      })
      .catch((error) =>
        this.setState({ submitting: false, warning: error.response.data })
      );

    if (!resp) return this.setState({ submitting: false });

    const nonce = resp.data;
    const cnonce = getRandomKey();

    const passhash = CryptoJS.SHA256(this.state.password).toString();
    const encryptedPass = CryptoJS.AES.encrypt(passhash, `${nonce}${cnonce}`).toString();

    const loginResp = await axios
      .post(
        `/login`,
        {
          username: this.state.username,
          password: encryptedPass,
          cnonce,
        },
        {
          baseURL: this.props.server,
          timeout: 5000,
          withCredentials: true,
        }
      )
      .catch((error) => {
        if (error.response)
          return this.setState({ submitting: false, warning: error.response.data });
        if (error) this.setState({ submitting: false, warning: error.toString() });
      });

    if (loginResp) {
      this.setState({ submitting: false, completed: true });
      this.props.update({ username: Cookies.get(USER_COOKIE_NAME) });
    }
  }

  render() {
    return (
      <div className="border border-primary" style={baseStyle}>
        {this.state.completed && <Redirect to={'/'} />}
        <h1>Log In</h1>
        <form onSubmit={async (e) => await this.handleSubmit(e)} style={formStyle}>
          <FormGroup controlId={'username'} style={formCompStyle}>
            <FormLabel>Username:</FormLabel>
            <FormControl
              autoFocus
              type={'text'}
              value={this.state.username}
              onChange={(e) => this.setState({ username: e.target.value })}
            />
          </FormGroup>
          <FormGroup controlId={'current-password'} style={formCompStyle}>
            <FormLabel>Passphrase:</FormLabel>
            <FormControl
              value={this.state.password}
              type={'password'}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
          </FormGroup>
          {this.state.warning && <div style={warningStyle}>{this.state.warning}</div>}
          <Button style={buttonStyle} disabled={this.state.submitting} type={'submit'}>
            Log In
          </Button>
        </form>
      </div>
    );
  }
}
