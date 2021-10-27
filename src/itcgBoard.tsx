import React from 'react';
import { BoardProps } from 'boardgame.io/react';

import { GameState } from './game';
import { getOpponentID } from './utils';
import { Location } from './actions';

import { ITCGCharacter } from './itcgCharacter';
import { ITCGDialog, DialogBoxOpts } from './itcgDialog';
import { ITCGDiscard } from './itcgDiscard';
import { ITCGDeck } from './itcgDeck';
import { ITCGField } from './itcgField';
import { ITCGGameOver } from './itcgGameOver';
import { ITCGHand } from './itcgHand';
import { ITCGHighlight } from './itcgHighlight';
import { ITCGInteractive } from './itcgInteractive';
import { ITCGStats } from './itcgStats';
import { mayFinished } from './target';

export interface State {
  dialogBox?: DialogBoxOpts;
}

const containerStyle: React.CSSProperties = {
  display: 'grid',
  position: 'relative',
  gridTemplateColumns: '15% 60% 10% 15%',
  gridTemplateRows: '20% 5% 50% 5% 20%',
  height: '100vh',
  gridTemplateAreas:
    "'odiscard ohand ohand char' 'ochar ostat ostat char' 'ochar field field char' 'ochar stat stat char' 'ochar hand interface discard'",
  backgroundColor: '#A3FFB4',
};

const dialogStyle: React.CSSProperties = {
  zIndex: 3,
  position: 'absolute',
  top: '33%',
  left: '25%',
};

const handStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#36896e',
  gridArea: 'hand',
  padding: '1%',
  alignItems: 'flex-end',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  gridArea: 'field',
};

const innerFieldStyle: React.CSSProperties = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
};

const interactiveStyle: React.CSSProperties = {
  display: 'flex',
  // backgroundColor: '#ffd700',
  gridArea: 'interface',
};

const discardStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#ffd700',
  gridArea: 'discard',
};

const statStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#2f2f2f',
  gridArea: 'stat',
};

const charStyle: React.CSSProperties = {
  backgroundColor: '#40e0d0',
  paddingTop: '1em',
  gridArea: 'char',
};

const oppHandStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#36896e',
  padding: '1%',
  gridArea: 'ohand',
};

const oppStatStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#2f2f2f',
  gridArea: 'ostat',
};

const oppDiscardStyle: React.CSSProperties = {
  display: 'flex',
  flex: '1',
  backgroundColor: '#ffd700',
  gridArea: 'odiscard',
};

const oppCharStyle: React.CSSProperties = {
  backgroundColor: '#40e0d0',
  paddingTop: '1em',
  gridArea: 'ochar',
};

export class ITCGBoard extends React.Component<BoardProps<GameState>> {
  state: State;

  constructor(props: BoardProps<GameState>) {
    super(props);

    this.state = {};
  }

  render() {
    const stack = this.props.G.stack;

    const playerID = this.props.playerID!;
    const playerState = this.props.G.player[playerID];
    const currentPlayerStage = this.props.ctx.activePlayers
      ? this.props.ctx.activePlayers[playerID]
      : '';

    const opponentID = getOpponentID(this.props.G, this.props.ctx, playerID);
    const opponentState = this.props.G.player[opponentID];
    const opponentStage = this.props.ctx.activePlayers
      ? this.props.ctx.activePlayers[opponentID]
      : '';

    // TODO: should display opponent's prompt as well
    const dialogPrompt = stack ? stack.activeDecisions[0].dialogPrompt || '' : '';

    const curDecisionFinished = stack ? stack.activeDecisions[0].finished : false;
    const decMaybeFinished =
      stack && stack.activeDecisions[0].target
        ? mayFinished(stack.activeDecisions[0].target)
        : false;

    const noResetDecision =
      stack && stack.activeDecisions[0].noReset
        ? stack.activeDecisions[0].noReset
        : false;

    const gameOver = this.props.ctx.gameover ? (
      <div style={dialogStyle}>
        <ITCGGameOver won={this.props.ctx.gameover.winner === playerID} />
      </div>
    ) : null;

    const choices =
      currentPlayerStage === 'choice' && stack
        ? stack.activeDecisions[0].choice || []
        : [];

    return (
      <div style={containerStyle}>
        {gameOver}
        <div style={dialogStyle}>
          <ITCGDialog
            playerState={playerState}
            opponentState={opponentState}
            currentPlayer={this.props.ctx.currentPlayer === this.props.playerID}
            select={this.props.moves.selectTarget}
            stage={
              this.props.ctx.activePlayers ? this.props.ctx.activePlayers[playerID] : ''
            }
            updateBoard={(state) => this.setState(state)}
            dialogBox={this.state.dialogBox}
          />
        </div>
        <div style={oppDiscardStyle}>
          <ITCGDeck
            playerState={opponentState}
            currentPlayer={this.props.ctx.currentPlayer === this.props.playerID}
            select={this.props.moves.selectTarget}
            updateBoard={(state) => this.setState(state)}
            mainPlayer={false}
          />
          <ITCGDiscard
            playerState={opponentState}
            currentPlayer={this.props.ctx.currentPlayer === this.props.playerID}
            select={this.props.moves.selectTarget}
            updateBoard={(state) => this.setState(state)}
            mainPlayer={false}
          />
        </div>
        <div style={oppHandStyle}>
          <ITCGHand playerState={opponentState} />
        </div>
        <div style={oppCharStyle}>
          <ITCGCharacter
            playerState={opponentState}
            currentPlayer={false}
            stage={
              this.props.ctx.activePlayers ? this.props.ctx.activePlayers[opponentID] : ''
            }
            turn={this.props.ctx.turn}
            activate={this.props.moves.activateSkill}
            select={this.props.moves.selectTarget}
          />
        </div>
        <div style={oppStatStyle}>
          <ITCGStats
            playerState={opponentState}
            prompt={dialogPrompt}
            stage={
              this.props.ctx.activePlayers ? this.props.ctx.activePlayers[opponentID] : ''
            }
          />
        </div>
        <div style={fieldStyle}>
          <div style={innerFieldStyle}>
            <ITCGField
              state={opponentState}
              location={Location.OppField}
              stage={opponentStage}
              select={this.props.moves.selectTarget}
              attack={this.props.moves.attack}
              source={stack?.activeDecisions[0].opts?.source}
            />
            <ITCGField
              state={playerState}
              location={Location.Field}
              select={this.props.moves.selectTarget}
              stage={currentPlayerStage}
              attack={this.props.moves.attack}
              source={stack?.activeDecisions[0].opts?.source}
            />
          </div>
          <ITCGHighlight state={this.props.G} ctx={this.props.ctx} />
        </div>
        <div style={statStyle}>
          <ITCGStats
            playerState={playerState}
            prompt={dialogPrompt}
            confMove={this.props.moves.confirmSkill}
            declMove={this.props.moves.resetStack}
            stage={
              this.props.ctx.activePlayers ? this.props.ctx.activePlayers[playerID] : ''
            }
          />
        </div>
        <div style={charStyle}>
          <ITCGCharacter
            playerState={playerState}
            currentPlayer={true}
            stage={currentPlayerStage}
            turn={this.props.ctx.turn}
            activate={this.props.moves.activateSkill}
            select={this.props.moves.selectTarget}
          />
        </div>
        <div style={handStyle}>
          <ITCGHand
            playerState={playerState}
            currentPlayer={this.props.ctx.currentPlayer === this.props.playerID}
            stage={currentPlayerStage}
            select={this.props.moves.selectTarget}
            level={this.props.moves.levelUp}
          />
        </div>
        <div style={interactiveStyle}>
          <ITCGInteractive
            stage={currentPlayerStage}
            choices={choices}
            decisionFinished={curDecisionFinished}
            decMaybeFinished={decMaybeFinished}
            showReset={!noResetDecision}
            noLevel={this.props.moves.noLevel}
            noActivate={this.props.moves.noActivate}
            noAttacks={this.props.moves.noAttacks}
            selectChoice={this.props.moves.selectChoice}
            confirm={this.props.moves.confirmSkill}
            resetStack={this.props.moves.resetStack}
          />
        </div>
        <div style={discardStyle}>
          <ITCGDiscard
            playerState={playerState}
            currentPlayer={this.props.ctx.currentPlayer === this.props.playerID}
            select={this.props.moves.selectTarget}
            updateBoard={(state) => this.setState(state)}
            mainPlayer={true}
          />
          <ITCGDeck
            playerState={playerState}
            currentPlayer={this.props.ctx.currentPlayer === this.props.playerID}
            select={this.props.moves.selectTarget}
            updateBoard={(state) => this.setState(state)}
            mainPlayer={true}
          />
        </div>
      </div>
    );
  }
}
