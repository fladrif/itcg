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
  posMove: () => any;
  negMove: () => any;

  constructor(props: InteractiveProp) {
    super(props);
    this.keydownFn = this.keydownFn.bind(this);

    this.posMove = this.currentPosMove();
    this.negMove = this.currentNegMove();
  }

  currentPosMove() {
    return this.props.stage === 'level'
      ? this.props.noLevel
      : this.props.stage === 'activate'
      ? this.props.noActivate
      : this.props.stage === 'attack'
      ? this.props.noAttacks
      : this.props.stage === 'select' && this.props.decisionFinished === true
      ? this.props.confirm
      : () => {};
  }

  currentNegMove() {
    return this.props.stage === 'select' ? this.props.decline : () => {};
  }

  keydownFn(e: KeyboardEvent) {
    if (e.key === ' ') {
      this.posMove();
    } else if (e.key === 'Escape') {
      this.negMove();
    }
  }

  componentDidUpdate() {
    this.posMove = this.currentPosMove();
    this.negMove = this.currentNegMove();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keydownFn);
  }

  componentDidUnMount() {
    document.removeEventListener('keydown', this.keydownFn);
  }

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
