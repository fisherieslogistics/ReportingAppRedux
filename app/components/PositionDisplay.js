'use strict';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import React from 'react';
import Sexagesimal from 'sexagesimal';
import {textStyles} from '../styles/styles';

class PositionDisplay extends React.Component{
  constructor(props){
    super(props);
    this.state={
      position: null,
    }
    setInterval(() => {
      this.setState({
        position: this.props.provider.getPosition()
      });
    }, 3000);
  }
  
  getPositionText(){
    if(!this.state.position){
      return "awaiting position";
    }
    let coords = this.state.position.coords;
    return Sexagesimal.format(coords.latitude, 'lat') + "  " + Sexagesimal.format(coords.longitude, 'lon');
  }

  render() {
    return (<Text style={[textStyles.font, {fontSize: 13}]}>{this.getPositionText()}</Text>);
  }
};

export default PositionDisplay
