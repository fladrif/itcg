import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { AppState } from '../App';

interface LogoutProp {
  server: string;
  update: (state: AppState) => void;
}

export class ITCGLogOut extends React.Component<LogoutProp> {
  async componentDidMount() {
    const resp = await axios
      .get(`/logout`, {
        baseURL: this.props.server,
        timeout: 1000,
        withCredentials: true,
      })
      .catch();

    if (resp) this.props.update({ username: undefined });
  }

  render() {
    return <Redirect to={'/'} />;
  }
}
