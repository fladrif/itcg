import React from 'react';

import { Choice } from './stack';
import { MoveOptions } from './moves';
import { getRandomKey } from './utils';
import { State as BoardState } from './itcgBoard';

interface InteractiveProp {
  stage: string;
  decisionFinished: boolean;
  decMaybeFinished: boolean;
  showReset: boolean;
  tempInSelectLoc: boolean;
  choices: Choice[];
  noLevel: () => any;
  noActivate: () => any;
  noAttacks: () => any;
  confirm: (opts?: MoveOptions) => any;
  selectChoice: () => any;
  resetStack: () => any;
  updateBoard: (state: BoardState) => any;
}

export interface DialogButtons {
  label: string;
  move: (opts?: MoveOptions) => any;
  choice?: Choice;
  sentiment?: 'pos' | 'neg' | 'neu';
  condition?: keyof InteractiveProp;
}

export interface Dialog {
  stage: string;
  prompt: string;
  buttons: DialogButtons[];
}

const baseStyle: React.CSSProperties = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  overflow: 'hidden',
};

const buttonStyle: React.CSSProperties = {
  flex: '1',
  color: 'white',
  textShadow: '1px 1px 2px black',
  fontSize: '1.5vw',
  borderRadius: '0.5em',
  margin: '2%',
};

const neuButtonStyle: React.CSSProperties = {
  background: 'radial-gradient(#A95AA1, #C28BBD)',
  ...buttonStyle,
};

const posButtonStyle: React.CSSProperties = {
  background: 'radial-gradient(#934822, #F5793A)',
  ...buttonStyle,
};

const negButtonStyle: React.CSSProperties = {
  background: 'radial-gradient(#0D1C73, #3E4C99)',
  ...buttonStyle,
};

export class ITCGInteractive extends React.Component<InteractiveProp> {
  posMove: () => any;
  negMove: () => any;
  stagePrompts: Dialog[];

  constructor(props: InteractiveProp) {
    super(props);
    this.keydownFn = this.keydownFn.bind(this);

    this.posMove = this.currentPosMove();
    this.negMove = this.currentNegMove();

    this.stagePrompts = [];
  }

  setStagePrompts() {
    this.stagePrompts = [
      {
        stage: 'level',
        prompt: 'Level up with a card',
        buttons: [
          {
            label: 'Do not Level',
            sentiment: 'neg',
            move: this.props.noLevel,
          },
        ],
      },
      {
        stage: 'activate',
        prompt: 'Activate a Skill',
        buttons: [
          {
            label: 'Go to Attack Stage',
            sentiment: 'neg',
            move: this.props.noActivate,
          },
        ],
      },
      {
        stage: 'attack',
        prompt: 'Attack with your monsters',
        buttons: [
          {
            label: 'Pass Turn',
            sentiment: 'neg',
            move: this.props.noAttacks,
          },
        ],
      },
      {
        stage: 'select',
        prompt: 'Select a card',
        buttons: [
          {
            label: 'Show Temporary Zone',
            sentiment: 'neu',
            move: () => this.updateBoard(),
            condition: 'tempInSelectLoc',
          },
          {
            label: 'Confirm',
            sentiment: 'pos',
            move: this.props.decMaybeFinished
              ? () => this.props.confirm({ finished: true })
              : this.props.confirm,
            condition: this.props.decMaybeFinished
              ? 'decMaybeFinished'
              : 'decisionFinished',
          },
          {
            label: 'Undo',
            sentiment: 'neg',
            move: this.props.resetStack,
            condition: 'showReset',
          },
        ],
      },
      {
        stage: 'choice',
        prompt: 'Choose one',
        buttons: this.props.choices
          .map((choice) => {
            const button: DialogButtons = {
              label: choice,
              move: this.props.selectChoice,
              choice: choice,
              sentiment: 'neu',
            };
            return button;
          })
          .concat({
            label: 'Undo',
            sentiment: 'neg',
            move: this.props.resetStack,
            condition: 'showReset',
          }),
      },
    ];
  }

  // TODO: update to respect stagePrompts
  currentPosMove() {
    return this.props.stage === 'level'
      ? this.props.noLevel
      : this.props.stage === 'activate'
      ? this.props.noActivate
      : this.props.stage === 'attack'
      ? this.props.noAttacks
      : this.props.stage === 'select' && this.props.decisionFinished === true
      ? this.props.decMaybeFinished
        ? () => this.props.confirm({ finished: true })
        : this.props.confirm
      : () => {};
  }

  currentNegMove() {
    return this.props.stage === 'select' ? this.props.resetStack : () => {};
  }

  currentStage(): Dialog {
    return (
      this.stagePrompts.filter((prompt) => prompt.stage === this.props.stage)[0] || {
        stage: '',
        prompt: '',
        buttons: [],
      }
    );
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

  updateBoard() {
    const newBoardState: BoardState = {
      dialogBox: 'temp',
    };

    this.props.updateBoard(newBoardState);
  }

  render() {
    this.setStagePrompts();
    const stage = this.currentStage();

    const buttons = stage.buttons.map((button) => {
      const isVisible = button.condition ? !!this.props[button.condition] : true;
      if (!isVisible) return null;

      const style = button.sentiment
        ? button.sentiment == 'pos'
          ? posButtonStyle
          : button.sentiment == 'neg'
          ? negButtonStyle
          : neuButtonStyle
        : buttonStyle;

      const move =
        stage.stage === 'choice'
          ? () => button.move({ choice: button.choice })
          : () => button.move();

      return (
        <button className="btn-block" style={style} onClick={move} key={getRandomKey()}>
          {button.label}
        </button>
      );
    });

    return <div style={baseStyle}>{buttons}</div>;
  }
}
