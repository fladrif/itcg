import React from 'react';

interface ProgressBarProps {
  hp: number;
  maxHP: number;
}

const barStyle: React.CSSProperties = {
  background: 'linear-gradient(#d3d3d3, 80%, #5c5c5c)',
  marginLeft: '0.1em',
  border: 'solid',
  borderRadius: '0.5em',
  width: '100%',
  overflow: 'hidden',
};

const defaultFillerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(#ff0000, 80%, #5c5c5c)',
  transition: 'width .4s ease-in',
  height: '100%',
  whiteSpace: 'nowrap',
};

export class ProgressBar extends React.Component<ProgressBarProps> {
  render() {
    const denom = this.props.hp > this.props.maxHP ? this.props.hp : this.props.maxHP;
    const percentage = (this.props.hp / denom) * 100;
    const fillerStyle = {
      width: `${percentage}%`,
      ...defaultFillerStyle,
    };

    return (
      <div style={barStyle}>
        <div style={fillerStyle}>
          HP:[<b>{this.props.hp}</b>/{this.props.maxHP}]
        </div>
      </div>
    );
  }
}
