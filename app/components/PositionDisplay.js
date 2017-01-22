'use strict';
import {
  View,
  Text
} from 'react-native';

import React from 'react';
import Sexagesimal from 'sexagesimal';
import {textStyles, colors} from '../styles/styles';
import moment from 'moment';

class PositionDisplay extends React.Component{
  constructor(props){
    super(props);
    this.state={
      position: null,
    }
  }

  getPositionText(){
    if(!this.state.position || !this.state.position.coords){
      return "awaiting position";
    }
    const coords = this.state.position.coords;
    const posText = `${Sexagesimal.format(coords.latitude, 'lat')}   ${Sexagesimal.format(coords.longitude, 'lon')}`;
    return posText;
  }

  getTimeText(){
    return new moment(this.state.position ? this.state.position.timestamp : 0).fromNow();
  }

  render() {
    const viewStyle = {flex: 1, marginBottom: 20, marginLeft: 25, height: 40};
    const textStyle = [textStyles.font, {fontSize: 18, color: colors.green}];
    return (
      <View style={viewStyle}>
          <Text style={textStyle}>
            {this.getPositionText()}
          </Text>
          <Text style={[textStyle, { fontSize: 12 }]}>
            {this.getTimeText()}
          </Text>
      </View>
    );
  }
}

export default PositionDisplay
