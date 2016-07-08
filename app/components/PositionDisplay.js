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
  getPositionText(){
    const position = this.props.provider.getPosition();
    if(!position){
      return "awaiting position";
    }
    let coords = position.coords;
    return Sexagesimal.format(coords.latitude, 'lat') + "  " + Sexagesimal.format(coords.longitude, 'lon');
  }

  render() {
    return (<Text style={[textStyles.font, {fontSize: 13}]}>{this.getPositionText()}</Text>);
  }
};

export default PositionDisplay
