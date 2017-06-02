import React, { Component } from 'react';
import {debounce} from 'lodash';
import Hammer from 'hammerjs';
import { isFullScreen, toggleFullScreen } from './utils';


export default class TouchVideo extends Component{
  constructor(props) {
    super(props)
    this.state = {
      start: 0,
      distance: 0,
      currentTime: 0,
      scrubTimer: null,
      skipTimer: null,
      holding: false,
      scrubbing: false
    };
  }

  componentDidMount() {
    this.mc = new Hammer.Manager(this.video, {
      recognizers: [
        // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
        [Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }],
        [Hammer.Press, { time: 500 }],
      ]
    });
    this.mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
    this.mc.add( new Hammer.Tap({ event: 'singletap' }) );
    this.mc.get('doubletap').recognizeWith('singletap');
    this.mc.get('singletap').requireFailure('doubletap');
    this.mc.on('singletap', this.handleTap.bind(this));
    this.mc.on('doubletap', this.toggleFullScreen.bind(this));
    this.mc.on('pan', this.handlePan.bind(this));
    this.mc.on('press', this.showContextualMenu.bind(this));
  }

  handlePan(e) {
    console.log('Pan:', e);
  }

  handleTap(e) {
    if(this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  handleTimeUpdate(){
    if(!this.state.scrubbing) {
      this.setState({currentTime: this.video.currentTime.toFixed(1)});
      // progressBar.style.width = (vid.currentTime / vid.duration) * 100 + '%';
    }
  }

  toggleFullScreen() {
    toggleFullScreen(this.video);
  }

  showContextualMenu(e) {
    console.log(e);
  }

  render() {
    return (
      <div className="touchscrub-container">
        <video
          onTimeUpdate={this.handleTimeUpdate.bind(this)}
          ref={ video => this.video = video}
          {...this.props}
        >
        </video>
        <div id="touchscrub-time" className="touchscrub-time-passive">{this.state.currentTime}</div>
        <div id="touchscrub-progress-bar" className="touchscrub-progress-bar-passive"></div>
        <div className="touchscrub-scrub-direction"></div>
        <div className="touchscrub-scrub-divider"></div>
      </div>
    );
  }

}