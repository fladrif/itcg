import React from 'react';
import { BoardProps } from 'boardgame.io/react';

import { GameState } from './game';
import { getOpponentID } from './utils';
import { Location } from './actions';

import { ITCGCardback } from './itcgCard';
import { ITCGStats } from './itcgStats';
import { ITCGCharacter } from './itcgCharacter';
import { ITCGHand } from './itcgHand';
import { ITCGInteractive } from './itcgInteractive';
import { ITCGField } from './itcgField';
import { ITCGGameOver } from './itcgGameOver';

const containerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '15% 70% 15%',
  gridTemplateRows: '20% 5% 50% 5% 20%',
  height: '100vh',
  gridTemplateAreas:
    "'od oh oh' 'ochar ostat char' 'ochar m char' 'ochar stat char' 'h h d'",
  backgroundColor: '#A3FFB4',
};

const gameOverStyle: React.CSSProperties = {
  zIndex: 3,
  position: 'absolute',
  marginLeft: '25%',
  marginTop: '15%',
};

const handStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#36896e',
  gridArea: 'h',
  alignItems: 'flex-end',
};

const mapStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#c9def2',
  gridArea: 'm',
};

const interactiveStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#ffd700',
  gridArea: 'd',
};

const statStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#2f2f2f',
  gridArea: 'stat',
};

const charStyle: React.CSSProperties = {
  backgroundColor: '#40e0d0',
  gridArea: 'char',
};

const oppHandStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#36896e',
  gridArea: 'oh',
};

const oppStatStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#2f2f2f',
  gridArea: 'ostat',
};

const oppInteractiveStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#ffd700',
  gridArea: 'od',
};

const oppCharStyle: React.CSSProperties = {
  backgroundColor: '#40e0d0',
  gridArea: 'ochar',
};

export class ITCGBoard extends React.Component<BoardProps<GameState>> {
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

    const curDecisionFinished = stack ? stack.activeDecisions[0].finished : false;

    const gameOver = this.props.ctx.gameover ? (
      <div style={gameOverStyle}>
        <ITCGGameOver won={this.props.ctx.gameover.winner === playerID} />
      </div>
    ) : null;

    return (
      <div style={containerStyle}>
        {gameOver}
        <div style={oppInteractiveStyle}>
          <ITCGCardback />
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
            stage={
              this.props.ctx.activePlayers ? this.props.ctx.activePlayers[opponentID] : ''
            }
          />
        </div>
        <div style={mapStyle}>
          <ITCGField
            state={opponentState}
            location={Location.OppField}
            stage={opponentStage}
            select={this.props.moves.selectTarget}
            attack={this.props.moves.attack}
            attacker={stack?.activeDecisions[0].opts?.attacker}
          />
          <ITCGField
            state={playerState}
            location={Location.Field}
            select={this.props.moves.selectTarget}
            stage={currentPlayerStage}
            attack={this.props.moves.attack}
            attacker={stack?.activeDecisions[0].opts?.attacker}
          />
        </div>
        <div style={statStyle}>
          <ITCGStats
            playerState={playerState}
            confMove={this.props.moves.confirmSkill}
            declMove={this.props.moves.declineSkill}
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
            stage={currentPlayerStage}
            playerState={playerState}
            select={this.props.moves.selectTarget}
            level={this.props.moves.levelUp}
          />
        </div>
        <div style={interactiveStyle}>
          <ITCGInteractive
            stage={currentPlayerStage}
            decisionFinished={curDecisionFinished}
            noLevel={this.props.moves.noLevel}
            noActivate={this.props.moves.noActivate}
            noAttacks={this.props.moves.noAttacks}
            confirm={this.props.moves.confirmSkill}
            decline={this.props.moves.declineSkill}
          />
        </div>
      </div>
    );
  }
}
