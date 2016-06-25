'use strict';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import React from 'react';

export class MasterDetailView extends React.Component {

  render(){
    return (
      <View style={[styles.wrapper]}>
        <View style={[styles.row, styles.small]}>
          {this.props.toolbar}
        </View>
        <View style={[styles.row]}>
          <View style={[styles.master]}>
            <View style={[styles.col, styles.background]}>{this.props.master}</View>
          </View>
          <View style={[styles.detail]}>
            <View style={[styles.col]}>{this.props.detail}</View>
          </View>
        </View>
    </View>);
  }
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    alignSelf: 'stretch'
  },
  small: {
    flex: 0.09
  },
  col: {
    flexDirection: 'column',
    flex: 1
  },
  row: {
    flexDirection: 'row',
    flex: 1
  },
  background:{
    backgroundColor: '#efeff4',
  },
  master: {
    flex: 0.3,
    flexDirection: 'column',
    borderRightColor: "#d9d9d9",
    borderRightWidth: 1,
    alignSelf: 'stretch',
    backgroundColor: '#efeff4',
  },
  detail:{
    flex: 0.7,
    flexDirection: 'column',
    borderLeftColor: "#efefef",
    borderLeftWidth: 1,
    //backgroundColor: "#FFFFFF"
  }
});

export default MasterDetailView
