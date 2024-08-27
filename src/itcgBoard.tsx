import React from 'react';
import { BoardProps } from 'boardgame.io/react';
import { Tooltip } from 'react-tooltip';

import { GameState, PlayerSettings } from './game';
import { getTargetLocations, Location, mayFinished } from './target';

import { ITCGAudio } from './itcgAudio';
import { ITCGCharacter } from './itcgCharacter';
import { ITCGDialog, DialogBoxOpts } from './itcgDialog';
import { ITCGDiscard } from './itcgDiscard';
import { ITCGDeck } from './itcgDeck';
import { ITCGField } from './itcgField';
import { ITCGGameOver } from './itcgGameOver';
import { ITCGHand } from './itcgHand';
import { ITCGHighlight } from './itcgHighlight';
import { ITCGInteractive } from './itcgInteractive';
import { ITCGMenu } from './itcgMenu';
import { ITCGMenuBox, MenuBoxOpts } from './itcgMenuBox';
import { ITCGStats } from './itcgStats';

import bgi from './images/red-scene.svg';

export interface State extends PlayerSettings {
  dialogBox?: DialogBoxOpts;
  menuBox?: MenuBoxOpts;
}

const containerStyle: React.CSSProperties = {
  display: 'grid',
  position: 'relative',
  gridTemplateColumns: '15% 60% 10% 15%',
  gridTemplateRows: '20% 5% 50% 5% 20%',
  height: '100vh',
  gridTemplateAreas:
    "'odiscard ohand menu char' 'ochar ostat ostat char' 'ochar field field char' 'ochar stat stat char' 'ochar hand interface discard'",
  backgroundImage: `url(${bgi})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

const highlightAction: React.CSSProperties = {
  boxShadow: 'inset -10px -10px 10px white, inset 10px 10px 10px white',
};

const dialogStyle: React.CSSProperties = {
  zIndex: 4,
  position: 'absolute',
  top: '20%',
  left: '15%',
};

const turnAlertStyle: React.CSSProperties = {
  pointerEvents: 'none',
  zIndex: 3,
  top: '40%',
  left: '30%',
  position: 'absolute',
  fontSize: '9vw',
  color: '#ee5f00',
  textShadow:
    '1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff',
};

const menuBoxStyle: React.CSSProperties = {
  zIndex: 5,
  position: 'absolute',
};

const tooltipStyle: React.CSSProperties = {
  zIndex: 4,
  padding: '1em',
  maxWidth: '30vw',
};

const menuStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'start',
  gridArea: 'menu',
};

const handStyle: React.CSSProperties = {
  display: 'flex',
  gridArea: 'hand',
  padding: '1%',
  alignItems: 'flex-end',
  overflow: 'auto',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  gridArea: 'field',
};

const innerFieldStyle: React.CSSProperties = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  overflow: 'auto',
};

const interactiveStyle: React.CSSProperties = {
  display: 'flex',
  gridArea: 'interface',
};

const discardStyle: React.CSSProperties = {
  display: 'flex',
  gridArea: 'discard',
};

const statStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: '#2f2f2f',
  gridArea: 'stat',
};

const charStyle: React.CSSProperties = {
  paddingTop: '1em',
  gridArea: 'char',
};

const oppHandStyle: React.CSSProperties = {
  display: 'flex',
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
  gridArea: 'odiscard',
};

const oppCharStyle: React.CSSProperties = {
  paddingTop: '1em',
  gridArea: 'ochar',
};

export class ITCGBoard extends React.Component<BoardProps<GameState>> {
  state: State;
  playerID?: string;

  constructor(props: BoardProps<GameState>) {
    super(props);

    this.playerID = props.playerID || undefined;

    const settings = !this.playerID
      ? { tooltipOpts: false }
      : props.G.player[this.playerID].settings;

    const soundOpts = settings.soundOpts || {
      mute: false,
      volume: 50,
    };
    const tooltipOpts = settings.tooltipOpts !== undefined ? settings.tooltipOpts : true;

    this.state = { soundOpts, tooltipOpts };
  }

  setBoardState(state: State) {
    const newState: State = state;
    if (this.state.dialogBox === state.dialogBox) newState.dialogBox = undefined;

    this.setState(newState);
  }

  render() {
    const stack = this.props.G.stack;

    const mainPlayer = this.playerID || '0';
    const playerState = this.props.G.player[mainPlayer];
    const currentPlayerStage = this.props.ctx.activePlayers
      ? this.props.ctx.activePlayers[mainPlayer]
      : '';
    const opponentID = Object.keys(this.props.G.player).filter(
      (id) => id !== mainPlayer
    )[0];
    const opponentState = this.props.G.player[opponentID];
    const opponentStage = this.props.ctx.activePlayers
      ? this.props.ctx.activePlayers[opponentID]
      : '';

    const curDecision = stack?.activeDecisions[0];

    const dialogPrompt = curDecision ? curDecision.dialogPrompt : undefined;

    const curDecisionFinished = curDecision ? curDecision.finished : false;
    const decMaybeFinished =
      curDecision && curDecision.target ? mayFinished(curDecision.target) : false;

    const noResetDecision =
      curDecision && curDecision.noReset ? curDecision.noReset : false;

    const gameOver = this.props.ctx.gameover ? (
      <div style={dialogStyle}>
        <ITCGGameOver won={this.props.ctx.gameover.winner === mainPlayer} />
      </div>
    ) : null;

    const choices =
      currentPlayerStage === 'choice' && curDecision ? curDecision.choice || [] : [];

    const selectLocations =
      currentPlayerStage === 'select' && curDecision
        ? getTargetLocations(curDecision.target)
        : [];

    const tempInSelectLoc = selectLocations.some((loc) =>
      [Location.Temporary, Location.OppTemporary].includes(loc)
    );

    const audio = <ITCGAudio soundOpts={this.state.soundOpts} />;
    const tooltips = (
      <>
        <Tooltip id="expanded-card" style={tooltipStyle} />
        <Tooltip
          id="level-tooltip"
          style={tooltipStyle}
          border="1px solid white"
          isOpen={currentPlayerStage === 'level' && this.state.tooltipOpts}
          place="top"
        >
          Click on a card in your hand to level up with it, or choose 'Do not Level'.
        </Tooltip>
        <Tooltip
          id="activate-tooltip"
          style={tooltipStyle}
          border="1px solid white"
          isOpen={currentPlayerStage === 'activate' && this.state.tooltipOpts}
          place="left"
        >
          Click the abilities on the cards to activate them. Abilities you cannot use will
          be shaded. Use them in order from top to bottom, skipped abilities cannot be
          used later.
        </Tooltip>
        <Tooltip
          id="field-tooltip"
          style={tooltipStyle}
          border="1px solid white"
          isOpen={currentPlayerStage === 'attack' && this.state.tooltipOpts}
          place="bottom"
        >
          Click on a monster to attack with it, or choose 'Pass turn'.
        </Tooltip>
      </>
    );

    return (
      <div style={containerStyle}>
        {audio}
        {gameOver}
        {tooltips}
        <div style={dialogStyle}>
          <ITCGDialog
            playerState={playerState}
            opponentState={opponentState}
            currentPlayer={this.props.ctx.currentPlayer === mainPlayer}
            select={this.props.moves.selectTarget}
            updateBoard={(state) => this.setBoardState(state)}
            dialogBox={this.state.dialogBox}
          />
        </div>
        <div style={menuBoxStyle}>
          <ITCGMenuBox
            updateBoard={(state) => this.setBoardState(state)}
            playerID={this.playerID}
            concede={this.props.moves.concede}
            menuBox={this.state.menuBox}
            soundOpts={this.state.soundOpts}
            tooltipOpts={this.state.tooltipOpts}
          />
        </div>
        <div style={oppDiscardStyle}>
          <ITCGDeck
            playerState={opponentState}
            currentPlayer={this.props.ctx.currentPlayer === this.playerID}
            updateBoard={(state) => this.setBoardState(state)}
            mainPlayer={false}
          />
          <ITCGDiscard
            playerState={opponentState}
            currentPlayer={this.props.ctx.currentPlayer === this.playerID}
            updateBoard={(state) => this.setBoardState(state)}
            mainPlayer={false}
          />
        </div>
        <div style={oppHandStyle}>
          <ITCGHand
            G={this.props.G}
            ctx={this.props.ctx}
            curDecision={curDecision}
            playerState={opponentState}
          />
        </div>
        <div style={menuStyle}>
          <ITCGMenu updateBoard={(state) => this.setBoardState(state)} />
        </div>
        <div style={oppCharStyle}>
          <ITCGCharacter
            G={this.props.G}
            ctx={this.props.ctx}
            curDecision={curDecision}
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
          <div
            data-tooltip-id="field-tooltip"
            style={
              currentPlayerStage === 'attack'
                ? { ...innerFieldStyle, ...highlightAction }
                : innerFieldStyle
            }
          >
            <ITCGField
              G={this.props.G}
              ctx={this.props.ctx}
              curDecision={curDecision}
              state={opponentState}
              location={Location.OppField}
              stage={opponentStage}
              select={this.props.moves.selectTarget}
              attack={this.props.moves.attack}
              source={stack?.activeDecisions[0].opts?.source}
            />
            <ITCGField
              G={this.props.G}
              ctx={this.props.ctx}
              curDecision={curDecision}
              state={playerState}
              location={Location.Field}
              select={this.props.moves.selectTarget}
              stage={currentPlayerStage}
              attack={this.props.moves.attack}
              source={stack?.activeDecisions[0].opts?.source}
            />
            {!!this.playerID && currentPlayerStage === 'level' && !this.props.G.stack && (
              <div style={turnAlertStyle}>Your Turn</div>
            )}
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
              this.props.ctx.activePlayers ? this.props.ctx.activePlayers[mainPlayer] : ''
            }
          />
        </div>
        <div
          data-tooltip-id="activate-tooltip"
          style={
            currentPlayerStage === 'activate'
              ? { ...charStyle, ...highlightAction }
              : charStyle
          }
        >
          <ITCGCharacter
            G={this.props.G}
            ctx={this.props.ctx}
            curDecision={curDecision}
            playerState={playerState}
            currentPlayer={true}
            stage={currentPlayerStage}
            turn={this.props.ctx.turn}
            activate={this.props.moves.activateSkill}
            select={this.props.moves.selectTarget}
          />
        </div>
        <div
          data-tooltip-id="level-tooltip"
          style={
            currentPlayerStage === 'level'
              ? { ...handStyle, ...highlightAction }
              : handStyle
          }
        >
          <ITCGHand
            G={this.props.G}
            ctx={this.props.ctx}
            playerState={playerState}
            curDecision={curDecision}
            currentPlayer={this.props.ctx.currentPlayer === this.props.playerID}
            stage={currentPlayerStage}
            select={!this.playerID ? undefined : this.props.moves.selectTarget}
            level={!this.playerID ? undefined : this.props.moves.levelUp}
          />
        </div>
        <div style={interactiveStyle}>
          {!!this.playerID && (
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
              updateBoard={(state) => this.setBoardState(state)}
              tempInSelectLoc={tempInSelectLoc}
            />
          )}
        </div>
        <div style={discardStyle}>
          <ITCGDiscard
            playerState={playerState}
            currentPlayer={this.props.ctx.currentPlayer === mainPlayer}
            updateBoard={(state) => this.setBoardState(state)}
            mainPlayer={true}
          />
          <ITCGDeck
            playerState={playerState}
            currentPlayer={this.props.ctx.currentPlayer === mainPlayer}
            updateBoard={(state) => this.setBoardState(state)}
            mainPlayer={true}
          />
        </div>
      </div>
    );
  }
}
