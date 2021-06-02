import React from "react";
import { PlayerState } from "./game";
import { ProgressBar } from "./progressBar";

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
    const denom =
      this.props.playerState.hp > this.props.playerState.maxHP
        ? this.props.playerState.hp
        : this.props.playerState.maxHP;

    return (
      <div style={statStyle}>
        <div style={levelStyle}>Lv: {this.props.playerState.level}</div>
        <ProgressBar hp={this.props.playerState.hp} maxHP={denom} />
      </div>
    );
  }
}
