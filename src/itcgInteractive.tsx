import React from 'react';

interface InteractiveProp {
  stage: string;
  decisionFinished: boolean;
  noLevel: () => any;
  noActivate: () => any;
  noAttacks: () => any;
  confirm: () => any;
  decline: () => any;
}

export class ITCGInteractive extends React.Component<InteractiveProp> {
  render() {
    const button =
      this.props.stage == 'level' ? (
        <div>
          <button onClick={() => this.props.noLevel()}>Skip Level Stage</button>
        </div>
      ) : this.props.stage == 'activate' ? (
        <div>
          <button onClick={() => this.props.noActivate()}>Go to Attack Stage</button>
        </div>
      ) : this.props.stage == 'attack' ? (
        <div>
          <button onClick={() => this.props.noAttacks()}>Pass Turn</button>
        </div>
      ) : this.props.stage == 'select' && this.props.decisionFinished == true ? (
        <div>
          <button onClick={() => this.props.confirm()}>Confirm</button>
          <button onClick={() => this.props.decline()}>Decline</button>
        </div>
      ) : this.props.stage == 'select' && this.props.decisionFinished == false ? (
        <div>
          <button onClick={() => this.props.decline()}>Decline</button>
        </div>
      ) : (
        <div>nothing</div>
      );

    return button;
  }
}
