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

function getDefaultFillerStyle(
  botLimit: number,
  midLimit: number,
  topLimit: number
): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    background: `linear-gradient(transparent, 80%, #5c5c5c), linear-gradient(90deg, #ff0000 ${botLimit}%, ${midLimit}%, #ff7f00 ${topLimit}%)`,
    transition: 'width .4s ease-in',
    height: '100%',
    whiteSpace: 'nowrap',
  };
}

export class ProgressBar extends React.Component<ProgressBarProps> {
  render() {
    const hp = this.props.hp <= 0 ? 0 : this.props.hp;
    const denom = hp > this.props.maxHP ? hp : this.props.maxHP;
    const percentage = (hp / denom) * 100;

    const overHeal = hp > this.props.maxHP ? hp - this.props.maxHP : 0;
    const overHealPerc = (overHeal / hp) * 100;

    const midLimit = 100 - overHealPerc;
    const botLimit = midLimit - 2 > 0 ? midLimit - 2 : 0;
    const topLimit = midLimit + 2 <= 100 ? midLimit + 2 : 100;

    const fillerStyle = {
      width: `${percentage}%`,
      color: 'black',
      fontSize: '1vw',
      ...getDefaultFillerStyle(botLimit, midLimit, topLimit),
    };

    return (
      <div style={barStyle}>
        <div style={fillerStyle}>
          HP:[<b>{hp}</b>/{this.props.maxHP}]
        </div>
      </div>
    );
  }
}
