import React from 'react';

export const ButtonStyle: React.CSSProperties = {
  textShadow: '1px 1px 2px grey',
  fontSize: '110%',
  borderRadius: '0.5em',
  alignItems: 'center',
  width: '10%',
};

export const OverallButtonStyle: React.CSSProperties = {
  ...ButtonStyle,
  marginTop: '1%',
  marginLeft: '80%',
  fontSize: '130%',
};

export const ParagraphStyle: React.CSSProperties = {
  textIndent: '5%',
  lineHeight: '175%',
};

export const CardStyle: React.CSSProperties = {
  background: 'linear-gradient(#DEEDAB, 85%, #B3DFA4)',
};

export const SecCardStyle: React.CSSProperties = {
  background: 'linear-gradient(#ABDEED, 85%, #A4B3DF)',
};

export const TriCardStyle: React.CSSProperties = {
  background: 'linear-gradient(#EDABDE, 85%, #DFA4B3)',
};
