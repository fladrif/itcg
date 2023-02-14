import React from 'react';
import { PlayerState } from './game';
import { ProgressBar } from './progressBar';

export interface StatProp {
  playerState: PlayerState;
  stage: string;
  prompt: string;
  confMove?: () => any;
  declMove?: () => any;
}

const statStyle: React.CSSProperties = {
  display: 'flex',
  width: '100%',
};

const levelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '0.25em',
  paddingRight: '0.25em',
  background: 'linear-gradient(#d3d3d3, 80%, #5c5c5c)',
  border: 'solid',
  borderRadius: '0.5em',
  textAlign: 'center',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  fontSize: '1vw',
};

const nameStyle: React.CSSProperties = {
  display: 'block',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: '0.25em',
  paddingRight: '0.25em',
  border: 'solid',
  borderRadius: '0.5em',
  borderColor: 'black',
  color: 'white',
};

const classStyle: React.CSSProperties = {
  color: 'lightgray',
  fontSize: '1vw',
};

const confirmationStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid',
  borderRadius: '0.5em',
  borderColor: 'black',
  overflow: 'hidden',
  flexWrap: 'nowrap',
  color: 'white',
  width: '40%',
};

const stageModalStyle: React.CSSProperties = {
  color: 'white',
  fontSize: '1vw',
};

const highlightModalStyle: React.CSSProperties = {
  color: 'yellow',
  border: 'solid',
  borderRadius: '0.25em',
  paddingLeft: '1%',
  paddingRight: '1%',
  margin: '1%',
  fontSize: '1.5vw',
};

export class ITCGStats extends React.Component<StatProp> {
  render() {
    const confModal = (
      <div style={confirmationStyle}>
        <div style={highlightModalStyle}>
          {this.props.prompt ? this.props.prompt : 'Choose one'}
        </div>
      </div>
    );

    const levelModal = (
      <div style={this.props.stage == 'level' ? highlightModalStyle : stageModalStyle}>
        level
      </div>
    );
    const activateModal = (
      <div style={this.props.stage == 'activate' ? highlightModalStyle : stageModalStyle}>
        activate
      </div>
    );
    const attackModal = (
      <div style={this.props.stage == 'attack' ? highlightModalStyle : stageModalStyle}>
        attack
      </div>
    );

    const stageModal = (
      <div style={confirmationStyle}>
        {levelModal} - {activateModal} - {attackModal}
      </div>
    );

    const selectModal = (
      <div style={confirmationStyle}>
        <div style={highlightModalStyle}>
          {this.props.prompt ? this.props.prompt : 'Please select a card'}
        </div>
      </div>
    );

    const modal =
      this.props.stage == 'confirmation' || this.props.stage == 'choice'
        ? confModal
        : this.props.stage == 'select'
        ? selectModal
        : stageModal;

    return (
      <div style={statStyle}>
        <div style={levelStyle}>Lv: {this.props.playerState.level}</div>
        <div style={nameStyle}>
          <div style={classStyle}>{this.props.playerState.character.class}</div>
          <div style={{ fontSize: '1vw' }}>{this.props.playerState.name}</div>
        </div>
        <ProgressBar
          hp={this.props.playerState.hp}
          maxHP={this.props.playerState.maxHP}
        />
        {modal}
      </div>
    );
  }
}
