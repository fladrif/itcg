import React from 'react';
import lodash from 'lodash';

import sunsetCove from './music/sunset_cove.mp4';
import quietWharf from './music/the_quiet_wharf.mp4';
import cathedralSea from './music/cathedral_of_the_sea.mp4';
import shoresideVillage from './music/curious_shoreside_village.mp3';

export interface SoundOpts {
  volume?: number;
  mute?: boolean;
}

interface AudioProp {
  soundOpts: SoundOpts;
}

export class ITCGAudio extends React.Component<AudioProp> {
  constructor(props: AudioProp) {
    super(props);
  }

  audio = new Audio();

  audioList = [sunsetCove, quietWharf, cathedralSea, shoresideVillage];

  audioIterator = lodash.shuffle(this.audioList).values();

  componentDidMount() {
    this.audio.src = this.audioIterator.next().value;
    this.audio.play();

    this.audio.addEventListener('ended', () => {
      let next = this.audioIterator.next();
      if (next.done) {
        this.audioIterator = lodash.shuffle(this.audioList).values();
        next = this.audioIterator.next();
      }

      this.audio.src = next.value;
      this.audio.play();
    });
  }

  componentWillUnmount() {
    this.audio.pause();
  }

  render() {
    const volume = this.props.soundOpts?.volume || 100;

    this.audio.volume = volume / 100;
    this.audio.muted = this.props.soundOpts?.mute || false;

    return <></>;
  }
}
