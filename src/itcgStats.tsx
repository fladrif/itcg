import React from "react";
import { PlayerState } from "./game";

export interface StatProp {
  playerState: PlayerState;
}

const statStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
};

const levelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  paddingLeft: "0.25em",
  paddingRight: "0.25em",
  background: "linear-gradient(#d3d3d3, 80%, #5c5c5c)",
  border: "solid",
  borderRadius: "0.5em",
  textAlign: "center",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
};

export class ITCGStats extends React.Component<StatProp> {
  render() {
    return (
      <div style={statStyle}>
        <div style={levelStyle}>Lv: {this.props.playerState.level}</div>
        <ProgressBar
          hp={this.props.playerState.hp}
          maxHP={this.props.playerState.maxHP}
        />
      </div>
    );
  }
}

interface ProgressBarProps {
  hp: number;
  maxHP: number;
}

const barStyle: React.CSSProperties = {
  background: "linear-gradient(#d3d3d3, 80%, #5c5c5c)",
  marginLeft: "0.1em",
  border: "solid",
  borderRadius: "0.5em",
  width: "100%",
  overflow: "hidden",
};

const defaultFillerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(#ff0000, 80%, #5c5c5c)",
  transition: "width .2s ease-in",
  height: "100%",
  whiteSpace: "nowrap",
};

class ProgressBar extends React.Component<ProgressBarProps> {
  render() {
    const percentage = (this.props.hp / this.props.maxHP) * 100;
    const fillerStyle = {
      width: `${percentage}%`,
      ...defaultFillerStyle,
    };

    return (
      <div style={barStyle}>
        <div style={fillerStyle}>
          HP:[{this.props.hp}/{this.props.maxHP}]
        </div>
      </div>
    );
  }
}
