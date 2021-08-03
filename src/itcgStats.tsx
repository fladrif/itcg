import React from 'react';
import { PlayerState } from './game';
import { ProgressBar } from './progressBar';

export interface StatProp {
  playerState: PlayerState;
  stage: string;
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
};

const highlightModalStyle: React.CSSProperties = {
  color: 'yellow',
  border: 'solid',
  borderRadius: '0.25em',
  padding: '1%',
  margin: '1%',
  fontSize: '150%',
};

export class ITCGStats extends React.Component<StatProp> {
  render() {
    const confModal = (
      <div style={confirmationStyle}>
        <button onClick={() => this.props.confMove!()}>confirm</button>
        <button onClick={() => this.props.declMove!()}>decline</button>
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
        <div style={highlightModalStyle}>Please select a card</div>
      </div>
    );

    const modal =
      this.props.stage == 'confirmation'
        ? confModal
        : this.props.stage == 'select'
        ? selectModal
        : stageModal;

    return (
      <div style={statStyle}>
        <div style={levelStyle}>Lv: {this.props.playerState.level}</div>
        <ProgressBar
          hp={this.props.playerState.hp}
          maxHP={this.props.playerState.maxHP}
        />
        {modal}
      </div>
    );
  }
}
