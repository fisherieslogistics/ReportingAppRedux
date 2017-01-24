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

  constructor(props) {
    super(props);
    this.getPositionText = this.getPositionText.bind(this);
    this.getTimeText = this.getTimeText.bind(this);
  }

  getPositionText(){
    if(!(this.props.position && this.props.position.coords)){
      return "awaiting position";
    }
    const coords = this.props.position.coords;
    const posText = `${Sexagesimal.format(coords.latitude, 'lat')}   ${Sexagesimal.format(coords.longitude, 'lon')}`;
    return posText;
  }

  getTimeText(){
    if(!(this.props.position && this.props.position.coords)){
      return "";
    }
    return new moment(this.props.position.timestamp).fromNow();
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
