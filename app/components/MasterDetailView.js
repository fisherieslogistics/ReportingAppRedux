'use strict';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import React from 'react';

import {shadowStyles, colors} from '../styles/styles';

const MasterDetail = (props) => {
  return (
    <View style={[styles.wrapper]}>
      <View style={[styles.row]}>
        <View style={[styles.master, shadowStyles.shadow]}>
            {props.masterToolbar}
          <View style={[styles.col, styles.background]}>
            {props.master}
          </View>
        </View>
        <View style={[styles.detail, shadowStyles.shadow]}>
          {props.detailToolbar}
          <View style={[styles.col]}>
            {props.detail}
          </View>
        </View>
      </View>
  </View>);
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: colors.backgrounds.dark,
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
    backgroundColor: colors.backgrounds.dark,
  },
  master: {
    flex: 0.3,
    flexDirection: 'column',
    alignSelf: 'stretch',
    backgroundColor: colors.backgrounds.dark,
  },
  detail:{
    flex: 0.7,
    flexDirection: 'column',
  },
});

export default MasterDetail
