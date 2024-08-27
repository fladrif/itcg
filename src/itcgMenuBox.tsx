import React from 'react';
import { PlayerID } from 'boardgame.io';
import axios from 'axios';

import { SoundOpts } from './game';
import { State as BoardState } from './itcgBoard';
import { MoveOptions } from './moves';
import { SERVER } from './config';

interface MenuBoxProp {
  updateBoard: (state: BoardState) => any;
  concede: (opts: MoveOptions) => any;
  playerID?: PlayerID;
  tooltipOpts?: boolean;
  menuBox?: MenuBoxOpts;
  soundOpts?: SoundOpts;
}

export type MenuBoxOpts = 'menu' | 'concede' | 'music';

const baseStyle: React.CSSProperties = {
  display: 'flex',
  width: '100vw',
  height: '100vh',
  justifyContent: 'center',
  backgroundColor: 'rgba(84, 84, 84, 0.5)',
};

const innerBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textShadow:
    '2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
  textAlign: 'center',
  width: '33vw',
  height: '100vh',
  fontSize: '3vw',
  backgroundColor: 'rgba(84, 84, 84, 0.5)',
};

const subMenuStyle: React.CSSProperties = {
  alignSelf: 'center',
  borderRadius: '0.5em',
  marginTop: '5%',
  fontSize: '2vw',
  paddingLeft: '5%',
  paddingRight: '5%',
};

const subSubMenuStyle: React.CSSProperties = {
  backgroundColor: 'white',
  opacity: '90%',
  alignSelf: 'center',
  borderRadius: '0.5em',
  fontSize: '1.2vw',
  marginTop: '2%',
  paddingTop: '2%',
  paddingBottom: '1%',
  paddingLeft: '1%',
  paddingRight: '1%',
};

export class ITCGMenuBox extends React.Component<MenuBoxProp> {
  reload() {
    window.location.reload();
  }

  concede() {
    this.props.updateBoard({ menuBox: 'concede' });
  }

  back() {
    this.props.updateBoard({ menuBox: undefined });
  }

  yes() {
    this.props.updateBoard({ menuBox: undefined });
    this.props.concede({ playerConcession: this.props.playerID });
  }

  menu() {
    this.props.updateBoard({ menuBox: 'menu' });
  }

  music() {
    this.props.updateBoard({ menuBox: 'music' });
  }

  // TODO add variable wait to prevent simultaneous requests
  // Request can be async, update is decoupled from effect
  // TODO should set latest state instead of args
  async updateSettings(soundOpts: SoundOpts, tooltipOpts: boolean) {
    await axios.post(
      '/settings/upsert',
      {
        settings: {
          soundOpts,
          tooltipOpts,
        },
      },
      {
        baseURL: SERVER,
        timeout: 5000,
        withCredentials: true,
      }
    );
  }

  async toggleMute() {
    const soundOpts = {
      mute: !this.props.soundOpts?.mute,
      volume: this.props.soundOpts?.volume || 50,
    };
    this.props.updateBoard({ soundOpts });

    await this.updateSettings(soundOpts, !!this.props.tooltipOpts);
  }

  async toggleTooltips() {
    const tooltipOpts = !this.props.tooltipOpts;
    this.props.updateBoard({ tooltipOpts });

    await this.updateSettings(
      this.props.soundOpts || { volume: 50, mute: false },
      tooltipOpts
    );
  }

  async changeVolume(vol: number) {
    const soundOpts = { mute: this.props.soundOpts?.mute, volume: vol };

    this.props.updateBoard({ soundOpts });

    await this.updateSettings(soundOpts, !!this.props.tooltipOpts);
  }

  mainMenu() {
    return (
      <>
        Menu
        <button style={subMenuStyle} onClick={() => this.music()}>
          Music
        </button>
        <label htmlFor="paperSwitch6" className="paper-switch-label" style={subMenuStyle}>
          Tooltips
        </label>
        <fieldset className="form-group" style={subSubMenuStyle}>
          <label htmlFor="paperSwitch6" className="paper-switch-label">
            Off
          </label>
          <label className="paper-switch">
            <input
              id="paperSwitch6"
              name="paperSwitch6"
              type="checkbox"
              checked={this.props.tooltipOpts}
              onChange={async () => await this.toggleTooltips()}
            />
            <span className="paper-switch-slider round"></span>
          </label>
          <label htmlFor="paperSwitch6" className="paper-switch-label">
            On
          </label>
        </fieldset>
        <div style={subMenuStyle} />
        <button
          className="btn-danger-outline"
          style={subMenuStyle}
          onClick={!this.props.playerID ? this.reload.bind(this) : () => this.concede()}
        >
          {!this.props.playerID ? 'Leave' : 'Concede'}
        </button>
        <button
          className="btn-secondary-outline"
          style={subMenuStyle}
          onClick={() => this.back()}
        >
          Back
        </button>
      </>
    );
  }

  concedeMenu = (
    <>
      Concede the game?
      <button
        className="btn-danger-outline"
        style={subMenuStyle}
        onClick={() => this.yes()}
      >
        Yes
      </button>
      <button
        className="btn-secondary-outline"
        style={subMenuStyle}
        onClick={() => this.menu()}
      >
        No
      </button>
    </>
  );

  musicMenu() {
    return (
      <>
        Music Control
        <div style={subMenuStyle}>
          Volume
          <input
            className="input-block"
            type="range"
            min="0"
            max="100"
            defaultValue={
              this.props.soundOpts?.volume ? this.props.soundOpts?.volume : 100
            }
            onChange={async (e) => await this.changeVolume(parseInt(e.target.value))}
          />
          <button
            className={this.props.soundOpts?.mute ? 'btn-primary' : 'btn-primary-outline'}
            style={subMenuStyle}
            onClick={async () => await this.toggleMute()}
          >
            {this.props.soundOpts?.mute ? 'Unmute' : 'Mute'}
          </button>
        </div>
        <button
          className="btn-secondary-outline"
          style={subMenuStyle}
          onClick={() => this.menu()}
        >
          Back
        </button>
      </>
    );
  }

  render() {
    if (this.props.menuBox === undefined) return null;

    return (
      <div style={baseStyle}>
        <div style={innerBoxStyle}>
          {this.props.menuBox === 'menu' && this.mainMenu()}
          {this.props.menuBox === 'concede' && this.concedeMenu}
          {this.props.menuBox === 'music' && this.musicMenu()}
        </div>
      </div>
    );
  }
}
