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
