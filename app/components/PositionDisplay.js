'use strict';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import React from 'react';
import Sexagesimal from 'sexagesimal';
import {textStyles} from '../styles/styles';
import moment from 'moment';

class PositionDisplay extends React.Component{
  constructor(props){
    super(props);
    this.state={
      position: null,
    }

  }

  componentWillMount(){
    this.interval = setInterval(() => {
      this.setState({
        position: this.props.provider.getPosition()
      });
    }, 2000);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  getPositionText(){
    if(!this.state.position || !this.state.position.coords){
      return "awaiting position";
    }
    let coords = this.state.position.coords;
    let posText = Sexagesimal.format(coords.latitude, 'lat') + "        " + Sexagesimal.format(coords.longitude, 'lon');
    let timeText = new moment(this.state.position.timestamp).fromNow();
    return `${posText}   -   ${timeText}`;
  }

  render() {
    return (<Text style={[textStyles.font, {fontSize: 13, marginTop: 2, color: '#fff'}]}>{this.getPositionText()}</Text>);
  }
};

export default PositionDisplay
