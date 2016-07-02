'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import React from 'react';

import {renderEditors} from '../utils/RenderingUtils';

class EventEditor extends React.Component{

    render() {
      if(!this.props.obj){
        return null;
      }
      return (
        <View style={[this.props.styles.col, this.props.styles.fill, {alignSelf: 'flex-start'}, this.props.styles.wrapper]}>
          {renderEditors(this.props)}
        </View>
      );
    }
};

export default EventEditor;
